"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// メモ
// URL のパラメータ（useParams で取れる id）は「文字列」扱い (string)
// API から返ってくる post.id は「数字」(number)

type Post = {
  id: number,
  title: string,
  thumbnailUrl: string,
  createdAt: string,
  categories: string[],
  content: string
}

type ApiResponse = {
  post: Post; // APIのJSONのpostの中には、Post型のデータが入っています
};

const Detail = () => {
  // useParamsがURLの数字を読み取る
  // useParams は常に「string | undefined」を返す設計なのでここでいうidは文字列だよと示す
  const { id } = useParams<{ id: string }>();
  
  // null を初期値にするならstateの型は Post | null
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // ローディング開始
      const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      // 「このdataはApiResponseの型である」と示す。その後Post型として扱われる
      const data: ApiResponse = await res.json(); // ※posts.jsとは中身が違うので注意（APIの方ではpostというオブジェクト名がある）
      setPost(data.post);
      setLoading(false); // ローディング終了
    }

    getData();
  }, [id]); // id が変わったときにもう一回実行

  if (loading) {
    return <div>読み込み中…</div>
  }

  if (!post) {
    return <div>データが見つかりませんでした。</div>;
  }

  return (
    <div className='container'>
      <div className='block mb-5'>
        <Image src={post.thumbnailUrl} width={800} height={400} alt={`${post.title}の画像`} />
      </div>
      <div className='flex justify-between mb-2'>
        <div className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="flex justify-between gap-2">
          {post.categories.map((category) => {
            return(
              <div key={category} className="border border-solid border-blue-900 rounded p-1 text-blue-900">
                {category}
              </div>
            )
          })}
        </div>
      </div>
      <h1 className="text-2xl mb-3">{post.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: post.content}}></p>
    </div>
  );
}

export default Detail;
