"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { MicroCmsPost } from '@/app/_types/MicroCmsPost';
import Image from 'next/image';

// メモ
// URL のパラメータ（useParams で取れる id）は「文字列」扱い (string)
// API から返ってくる post.id は「数字」(number)

// ▽詳細の返り値例
// {
//   "id": "aaa",
//   "title": "...",
//   "createdAt": "...",
//   "content": "..."
// }

const Detail = () => {
  // useParamsがURLの数字を読み取る
  // useParams は常に「string | undefined」を返す設計なのでここでいうidは文字列だよと示す
  const { id } = useParams<{ id: string }>();
  
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await fetch(
        `https://eito8.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KYE as string,
          },
        },
      );
      const data: MicroCmsPost = await res.json();
      setPost(data);
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
        <Image src={post.thumbnail.url} width={800} height={400} alt={`${post.title}の画像`} />
      </div>
      <div className='flex justify-between mb-2'>
        <div className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="flex justify-between gap-2">
          {post.categories.map((category) => {
            return(
              // key={category.id} →　microCMSが保証する一意な値としてベストなのがid。nameなどは変更の可能性があるから。
              <div key={category.id} className="border border-solid border-blue-900 rounded p-1 text-blue-900">
                {category.name}
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
