"use client"

import { useFetch } from "@/app/_hooks/useFetch";
import { PostsResponse, PostType } from "@/app/_types/Post";
import Link from "next/link";

export default function AdminPosts() {
  const { data, isLoading, error } = useFetch<PostsResponse>('/api/admin/posts')
  const posts = data?.posts;

  if (isLoading) {
    return <div className="container p-10">読み込み中…</div>;
  }

  if (error || !posts || posts.length === 0) {
    return <div className="container p-10">データが見つかりませんでした。</div>;
  }

  return (
    <>
      <div className="p-7">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">記事一覧</h1>
          <Link href="/admin/posts/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            新規作成
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-gray-500">記事が見つかりませんでした。</div>
        ) : (
          // 記事があるときのみmapを回す
          posts.map((post: PostType) => {
            return (
              <Link href={`/admin/posts/${post.id}`} key={post.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{post.title}</div>
                  <div className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  )
}