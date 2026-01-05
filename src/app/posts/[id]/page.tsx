"use client";

import { useParams } from "next/navigation";
import { PostResponse } from "../../_types/Post";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { useFetch } from "@/app/_hooks/useFetch";

export default function Post() {
  // 先にIDを取得する
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useFetch<PostResponse>(
    id ? `/api/posts/${id}` : null
  );

  const post = data?.post;

  if (isLoading) {
    return <div className="container p-10">読み込み中…</div>;
  }
  if (error || !post) {
    return <div className="container p-10">データが見つかりませんでした。</div>;
  }

  // 3. サムネイル画像のURL生成
  // getPublicUrlは同期処理なので、useEffectを使わず直接計算してOK
  let thumbnailImageUrl = null;
  if (post.thumbnailImageKey) {
    const { data: { publicUrl } } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(post.thumbnailImageKey);
    
    thumbnailImageUrl = publicUrl;
  }

  // 記事の表示
  return (
    <div className='container'>
      <div className='block mb-5'>
        {/* 画像の表示（存在チェックを入れて安全にする） */}
        {thumbnailImageUrl && (
          <div className="relative w-full h-[400px] mt-3">
            <Image src={thumbnailImageUrl} fill className="object-cover" alt={`${post.title}の画像`} />
          </div>
        )}
      </div>

      <div className='flex justify-between mb-2'>
        <div className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
        </div>

        {/* カテゴリーの表示（中間テーブル経由） */}
        <div className="flex justify-between gap-2">
          {post.postCategories?.map((pc) => {
            return (
              <div key={pc.category.id} className="border border-solid border-blue-900 rounded p-1 text-blue-900">
                {pc.category?.name}
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