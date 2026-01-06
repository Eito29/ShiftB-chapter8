## 使用した言語・ツール
TypeScript	          メイン言語。ミスを防ぐための「型（設計図）」を定義できる。
Next.js (App Router)	画面の枠組み。/admin/categories などのURLと画面を紐付ける。
Tailwind CSS	        デザイン担当。p-7 や text-xl などのクラス名で見た目を作る。
Supabase	            ユーザー管理（ログイン）と、データの保存場所（データベース）。
Prisma	              データベースと対話するツール。「テーブル」の形を決める。

## 使用したフック（Hooks）
# フックは、Reactの画面に「動き」や「外部との接続」を与える部品です。
useState	            画面内の一時的なメモ。 入力中の文字（name）などを保存する。
useEffect	            「〜した時」に動く処理。 データの読み込みが終わった時にフォームにセットする、など。
useParamsURLのIDを取得する。 /admin/categories/1 の 1 を抜き出す。
useSWR
  一度表示されれば、それ以降は画面に戻ってきても「読み込み中」にならず、キャッシュを利用して表示される。
  裏で最新データを取得し直して、差分があれば自動で再描画する。
  SWRはキャッシュを活用するため、「戻るボタン」で戻った際などにデータが瞬時に表示されます。

  例：「APIからのデータ取得」が必要なときは、ほぼすべてSWRを検討（useEffect + fetchの代わり）
  ```tsx
  import useSWR from 'swr'

  const fetcher = (url) => fetch(url).then((res) => res.json())

  function Profile() {
    const { data, error, isLoading } = useSWR('/api/user', fetcher)

    if (error) return <div>読み込みに失敗しました</div>
    if (isLoading) return <div>読み込み中...</div>

    return <div>こんにちは、{data.name}さん！</div>
  }
  ```

useFetch(自作のカスタムフック)
  コンポーネント側で管理していた「URL」や「fetcher関数」をuseFetch.tsに集結させて共通化させたもの。
  useSWR と ログイン情報 を合体させて、コンポーネント側では「1行でデータを取れる」ようにした。
  
  ```tsx
  // useFetch.ts (中身は useSWR を使っている)
  import useSWR from 'swr';

  export const useUser = (id: string) => {
    // ここでURLや共通のfetcherを定義してしまう
    const { data, error, isLoading } = useSWR(`/api/v1/users/${id}`, fetcher);
    
    return {
      user: data,
      isError: error,
      isLoading
    };
  };
  ```

## 考えの順番（型 → API → useFetch → 画面）
1. 「何」を表示したいか？       → データベースのテーブル (schema.prisma) と 型 (types) を作る。
2. 「どこから」取るか？         → API（route.ts）を作る。
3. 「どうやって」画面に出すか？  → useFetch で呼んで、map でループする。
4. 「変えた時」はどうするか？    → fetch (PUT/DELETE) して、mutate() で画面を更新する。

## 連携（データのバトンリレー）
1. URLからIDを取得
  場所: admin/categories/[id]/page.tsx (コンポーネント)
  内容: useParams() を使い、ブラウザのURL（例: /admin/categories/1）から id: "1" を取り出します。

  ```tsx
  const { id } = useParams<{ id: string }>();
  ```

2. データを注文（カスタムフックの呼び出し）
  場所: admin/categories/[id]/page.tsx
  内容: コンポーネントが useFetch(id) を呼び出します。
  この useFetch は内部で useSWR を使っており、キャッシュがあれば即座に、なければAPIへリクエストを投げます。

  ```tsx
  // 条件式   ?   正しいとき(A)   :   正しくないとき(B)
  // URLから取得したidがまだ準備できていない間は isLoading が走る。
  const { data, error, isLoading, mutate, token } = useFetch<CategoryResponse>(
    id ? `/api/admin/categories/${id}` : null
  );

  if (isLoading) return <div className="p-7">読み込み中...</div>;
  ```

3. 型定義を参照してデータを受け取る
  場所: _hooks/useFetch.ts ↔ _types/Category.ts
  内容: useFetch 内で _types/Category.ts を参照し、「このデータはCategory型だよ」と定義します。
  結果: コンポーネント側の data.category に、型安全な（入力補完が効く）状態でデータが届きます。

  ```tsx
  // 「useFetch くん、今回は CategoryResponse という型のデータが欲しいんだ。この型を <T> の中に入れて使ってね！」と依頼
  // 「了解！じゃあ <T> を全部 CategoryResponse に置き換えて処理するよ。」
  // 結果: data の中身が自動的に CategoryResponse 型になります。
  const { data, error, isLoading, mutate, token } = useFetch<CategoryResponse>(
    id ? `/api/admin/categories/${id}` : null
  );
  ```

4. 編集フォームの初期値にセット
  場所: admin/categories/[id]/page.tsx
  内容: ここで useEffect の出番です！
  「data が届いたら（＝依存配列）、useState の setName(data.category.name) を実行する」という処理を行い、フォームの空欄を埋めます。

  ```tsx
  // dataの中にcategory情報があれば実行する場所
  // dataとはAPIのGETでcategoryにidがあるのか判定している
  useEffect(() => {
    // ?は「もし左側（data）が空っぽだったら、そこで止まってね（エラーにしないでね）」 という意味
    if (data?.category) {
      // 編集用の（setName）に、書き写す
      setName(data.category.name);
    }
  }, [data]);
  
  const category = data?.category;
  ```

5. API実行と画面更新
  場所: * 実行：admin/categories/[id]/page.tsx のボタンから fetch(PUT) を飛ばす。
  受付：api/admin/categories/[id]/route.ts (API側) がデータベースを書き換える。
  更新：コンポーネントが mutate() を実行。
  内容: mutate() が呼ばれると、SWRが「保存されたキャッシュはもう古い！」と判断し、最新のデータを再取得して画面を書き換えます。

  ```tsx
  // 1. ボタン押下 ➔ PUT API で DB を更新
  try {
    // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  }

  // 2. mutate() ➔ GET API が再起動 ➔ 最新の data が届く。
  // これを呼ぶだけで、「古いデータを捨てる ➔ 最新データをGETする ➔ 画面を書き換える」 という一連の作業を自動でやってくれる。
  await mutate(); // 更新用メソッド
  ```