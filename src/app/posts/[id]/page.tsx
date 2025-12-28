"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostType } from "../../_types/Post";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

export default function Post() {
  // URLから「どの記事か」を読み取る
  // { id: "123" } のような形で入ってくるので、定数 id に代入。
  const { id } = useParams<{ id: string }>();

  // 記事データを入れる箱の準備
  // 最初はデータがないので null（何もない）を入れておく。
  // <PostType | null> は「記事データか、空っぽの状態のどちらかだよ」という意味。
  const [post, setPost] = useState<PostType | null>(null);

  // 表示用のフルURLを管理する
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)

  // 3. IDを元に、特定の記事を1つだけ取ってくる
  useEffect(() => {
    const fetchPost = async () => {
      
      // 指定されたIDを使って、APIに「この記事の詳細をちょうだい」とリクエスト
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();

      // APIから返ってきた「data.post」をsetPostに入れる
      setPost(data.post);

      // 記事データが取れたら、画像のURLを生成する
      if (data.post?.thumbnailImageKey) {
        const { data: { publicUrl } } = supabase.storage
          .from('post_thumbnail')
          .getPublicUrl(data.post.thumbnailImageKey)
        
        setThumbnailImageUrl(publicUrl)
      }
    };

    // IDが存在するときだけ、データ取得を実行する
    if (id) {
      fetchPost();
    }
  }, [id]); // 「URLのIDが変わったら、もう一度この作業をやり直してね」という合図。

  // データの到着待ち（ガード）
  // APIからデータが届くまでは null なので表示されるまで表示。
  if (!post) return <div>読み込み中（Loading...）</div>;

  // 記事の表示
  return (
    <div className='container'>
      <div className='block mb-5'>
        {/* 画像の表示（存在チェックを入れて安全にする） */}
        {thumbnailImageUrl && (
          <Image src={thumbnailImageUrl} width={800} height={400} alt={`${post.title}の画像`} />
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