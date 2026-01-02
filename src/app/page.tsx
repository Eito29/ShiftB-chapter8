"use client"

import Link from "next/link";
import type { PostType } from '@/app/_types/Post';
import useSWR from 'swr';
import { fetcher } from "@/app/_hooks/fetcher"; // 1. fetcherを定義

export default function Home() {
  // 2. useSWR を使う（useState と useEffect がこれ1行になっている）
  const { data, error, isLoading } = useSWR('/api/posts', fetcher);

  // 3. ローディング状態の判定
  if (isLoading) {
    return <div className="container p-10">読み込み中…</div>;
  }

  // 4. エラーまたはデータが空の場合の判定
  // data.posts が存在するかチェック
  const posts = data?.posts;

  if (error || !posts || posts.length === 0) {
    return <div className="container p-10">データが見つかりませんでした。</div>;
  }

  return (
    <div className="container">
      {/* posts 配列を map で1つずつ取り出す → post という変数に代入 */}
      {posts.map((post: PostType) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <div className="border border-solid mb-5 p-4">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-500">
                {/* post.createdAt生データ　→　newDateで文字列をDate型に変換　→　 .toLocaleDateString()で表記を変える*/}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex justify-between gap-2">
                {/* 中間テーブルの先のカテゴリを表示 */}
                {post.postCategories.map((pc) => {
                  return(
                    <div key={pc.category.id} className="border border-solid border-blue-900 rounded p-1 text-blue-900">{pc.category.name}</div>
                  );
                })}
              </div>
            </div>
            <h1 className="text-2xl mb-3">{post.title}</h1>
            <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </div>
        </Link>
      ))}
    </div>
  );
}