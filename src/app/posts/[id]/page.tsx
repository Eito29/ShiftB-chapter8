"use client";

import { useParams } from "next/navigation";
import { PostType } from "../../_types/Post";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/app/_hooks/fetcher";

export default function Post() {
  // 1. 先にIDを取得する
  const { id } = useParams<{ id: string }>();

  // 2. useSWRでデータ取得
  // idが存在しない場合は null を渡してリクエストを投げないようにする（条件付きフェッチ）
  const { data, error, isLoading } = useSWR( id ? `/api/posts/${id}` : null, fetcher);

  // ローディング中、もしくはエラー時の処理
  if (isLoading) return <div>読み込み中（Loading...）</div>;
  if (error || !data?.post) return <div>データの取得に失敗しました</div>;

  // post変数に格納
  const post: PostType = data.post;

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
      <div className='block mb-5 relative w-full h-[400px]'>
        {/* 画像の表示（存在チェックを入れて安全にする） */}
        {thumbnailImageUrl && (
          <Image src={thumbnailImageUrl} fill className="object-cover" alt={`${post.title}の画像`} />
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