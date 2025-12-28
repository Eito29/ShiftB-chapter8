"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { PostType } from "@/app/_types/Post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPosts() {
  const { token } = useSupabaseSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchAllPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Header に token を付与
          }
        })

        const data = await res.json();

        setPosts(data.posts);
      } catch (error) {
        console.error(error);
        alert("エラーが発生したため、取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [token]);

  if (loading) {
    return (
      <div className="p-7">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
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

        {posts?.map((post: PostType) => {
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
        })}
      </div>
    </>
  )
}