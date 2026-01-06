# 実務開発テンプレート (SWR + React Hook Form)
# データの取得・表示・更新・削除（CRUD）を最も効率的かつ安全に行うための黄金パターン

* **mutateの役割**
`fetch`でデータを書き換えただけでは、SWRが持っている古いキャッシュが表示され続けてしまう。
`mutate(キー)`を呼ぶことで、「このデータは古くなったから再取得して！」とSWRに命令できる。

* **reset(data)**
React Hook Formで `defaultValue` を使うと、
APIからデータが届く前にレンダリングされて空欄になることがある。
`useEffect` と `reset` を組み合わせると安全。

```tsx

// 0. 共通フェッチャー (utils/fetcher.ts 等)

// 認証なし
export const fetcher = (url: string) => 
  fetch(url).then(res => res.json());

// 認証あり (Array Key 用)
export const authFetcher = ([url, token]: [string, string]) =>
  fetch(url, {
    headers: { 
      Authorization: token, 
      "Content-Type": "application/json" 
    }
  }).then(res => res.json());

// 1. 閲覧画面 (記事一覧・詳細)
// SEOよりもユーザー体験やキャッシュの速さを優先する場合の構成。

export default function PostList() {
  const { data, isLoading } = useSWR('/api/posts', fetcher);
  const posts = data?.posts || [];

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 2. 管理画面 (一覧)
// 実務で必須となる 「認証トークン」「フォーム管理」「キャッシュ更新」 を組み合わせた最強パターン。
export default function AdminPostList() {
  const { token } = useSupabaseSession();
  
  // tokenがある時だけ実行。配列をキーにすることでキャッシュを分離。
  const { data, isLoading } = useSWR(
    token ? ['/api/admin/posts', token] : null, 
    authFetcher
  );

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div>
      {data?.posts?.map((p: any) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}

// 2. 管理画面 (編集・削除)
// react-hook-form の reset を使い、SWRで取得したデータをフォームに同期させる。
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

export default function AdminEditPage() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  // 1. データのリアルタイム取得
  const { data } = useSWR(
    token && id ? [`/api/admin/posts/${id}`, token] : null, 
    authFetcher
  );

  // 2. 取得したデータをフォームの初期値にセット (重要)
  useEffect(() => {
    if (data?.post) reset(data.post);
  }, [data, reset]);

  // 3. 更新処理 (PUT)
  const onSubmit = async (inputs: any) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { Authorization: token!, "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (res.ok) {
      // 一覧と詳細のキャッシュを最新にする
      mutate(['/api/admin/posts', token]);
      mutate([`/api/admin/posts/${id}`, token]);
      alert("更新完了");
    }
  };

  // 4. 削除処理 (DELETE)
  const onDelete = async () => {
    if (!confirm("削除しますか？")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { 
      method: "DELETE", 
      headers: { Authorization: token! } 
    });

    if (res.ok) {
      mutate(['/api/admin/posts', token]);
      router.push("/admin/posts");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      <button disabled={isSubmitting}>保存</button>
      <button type="button" onClick={onDelete}>削除</button>
    </form>
  );
}