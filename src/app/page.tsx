"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import type { PostType } from '@/app/_types/Post';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const res = await fetch('/api/posts');
      const data = await res.json();
      
      setPosts(data.posts);
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) {
    return <div className="container p-10">読み込み中…</div>;
  } 

  if (!posts || posts.length === 0) {
    return <div className="container p-10">データが見つかりませんでした。</div>;
  }

  return (
    <div className="container">
      {/* posts 配列を map で1つずつ取り出す → post という変数に代入 */}
      {posts.map((post) => (
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