"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import type { MicroCmsPost } from '@/app/_types/MicroCmsPost';

// メモ
//  :***[] 　変数に型を渡す
//  <***[]>　関数に型を渡す

//microCMSについて
// microCMS は 配列を直接返さない
// 返ってくるのは オブジェクト
// 記事配列は contents の中
// posts は配列だけ欲しい
// ▽一覧の返り値例
// {
//   "contents": [
//     { "id": "aaa", "title": "...", ... }
//   ],
//   "totalCount": 10
// }


type ApiResponse = {
  contents: MicroCmsPost[]; // 記事が複数入った配列（検証ツール>ットワーク>プレビュー）
};

export default function Home() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]); // 画面に表示する記事一覧
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await fetch(
        'https://eito8.microcms.io/api/v1/posts', // 管理画面で取得したエンドポイント
        {
          headers: { // fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KYE as string, // .env.localで設定した環境変数（as stringは型エラー回避用）
          },
        }
      )
      const data: ApiResponse = await res.json();
      setPosts(data.contents); // 記事配列（contents）だけを取り出してposts（MicroCmsPost[]）に入れている
      setLoading(false);
    }

    getData()
  }, [])

  if (loading) {
    return <div>読み込み中…</div>
  }

  // NG例　→　if (!posts){…}だと「空配列（5行目:true）じゃなかったら」＝falseになるため作用しない
  if (posts.length === 0) {
    return <div>データが見つかりませんでした。</div>;
  }

  return (
    <div className="container">
      {/* posts 配列を map で1つずつ取り出す → post という変数に代入 */}
      {posts.map((post) => {
        return (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="border border-solid mb-5 p-4">
              <div className="flex justify-between mb-2">
                <div className="text-sm text-gray-500">
                  {/* post.createdAt生データ　→　newDateで文字列をDate型に変換　→　 .toLocaleDateString()で表記を変える*/}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex justify-between gap-2">
                  {post.categories.map((category) => {
                    return (
                      <div key={category.id} className="border border-solid border-blue-900 rounded p-1 text-blue-900">{category.name}</div>
                    );
                  })}
                </div>
              </div>
              <h1 className="text-2xl mb-3">{post.title}</h1>
              <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}