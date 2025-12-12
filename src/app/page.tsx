"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

// メモ
// : Post[] 　変数に型を渡す
//  <Post[]>　関数に型を渡す

// APIから取得するデータの型を作っておく
type Post = {
  id: number,
  title: string,
  createdAt: string,
  categories: string[],
  content: string
}

// APIから取得しているJSONの形がオブジェクトなので型を浮くっておく
type ApiResponse = {
  posts: Post[];
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]); // 空配列=true。
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts`);
      const data: ApiResponse = await res.json(); // 取得データ【dataのpostsオブジェクト】をsetPostsにセット
      setPosts(data.posts);
      setLoading(false);
    }

    getData();
  }, []);

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
                      <div key={category} className="border border-solid border-blue-900 rounded p-1 text-blue-900">{category}</div>
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