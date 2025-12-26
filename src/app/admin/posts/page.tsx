"use client"

import { PostType } from "@/app/_types/Post"; // 記事データの型をインポート
import Link from "next/link"; // ページ遷移用のコンポーネント
import { useEffect, useState } from "react"; // Reactの基本フック

export default function AdminPosts() {
  /**
   * 1. 記事データを入れる箱を準備
   * 最初はデータがないので空の配列 [] をセットする
   */
  const [posts, setPosts] = useState<PostType[]>([]); // 記事一覧を格納する変数
  const [loading, setLoading] = useState(true); // 読み込み状態を管理（初期値はtrue）

  /**
   * 2. 画面が表示された時に記事を取得する
   */
  useEffect(() => {
    const fetchAllPosts = async () => { // 非同期でデータを取得する関数
      try { // 正常に動くことを期待する処理
        // API（/api/admin/posts）を呼び、DBから全記事を取る
        const res = await fetch("/api/admin/posts"); // fetchでAPIにリクエストを送信

        // データをjson形式で受け取る
        const data = await res.json(); // レスポンスを解析してJavaScriptのオブジェクトに変換

        // dataの中にあるpostsをsetPostsに入れ、箱を更新する
        // これで画面が再表示される
        setPosts(data.posts); // 取得した配列データをstateに保存
      } catch (error) { // 失敗したらここに来る。エラー内容は error に入る
        console.error(error); // 開発者ツールのコンソールにエラーを表示
        alert("エラーが発生したため、取得できませんでした"); // ユーザーに通知
      } finally { // 成功・失敗に関わらず最後に行う処理
        setLoading(false); // 読み込み終了。ローディング表示を消す
      }
    };

    // 上で定義した関数を実行する
    fetchAllPosts(); // useEffectの中で関数を呼び出し
  }, []); // 空の配列 [] なので、最初の1回だけ実行する（無限ループ防止）

  /**
   * 3. 画面の見た目
   */
  return (
    <>
      <div className="p-7">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">記事一覧</h1>
          {/* buttonの中にLinkを入れるのを避け、Link自体をボタン風に装飾 */}
          <Link href="/admin/posts/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            新規作成
          </Link>
        </div>

        {/* 記事データ(posts)を1つずつ取り出して表示する */}
        {posts.map((post: PostType) => {
          return (
            // 各記事への詳細リンク。keyには一意のidを指定
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div> {/* 記事のタイトルを表示 */}
                <div className="text-gray-500">
                  {/* UTC形式の日付をローカルの日付形式（YYYY/MM/DD等）に変換して表示 */}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  )
}