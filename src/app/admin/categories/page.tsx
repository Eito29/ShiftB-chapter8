"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Category } from "@/app/_types/Category";
import Link from "next/link";
import useSWR from 'swr';
import { authFetcher } from "@/app/_hooks/fetcher";

export default function AdminCategories() {
  const { token } = useSupabaseSession();

  // useSWR の中で fetcher を使う
  const { data } = useSWR(
    token ? ["/api/admin/categories", token] : null, 
    authFetcher
  );

  // data の中から categories を取り出す
  // データが届く前は空配列 [] になるようにしておくとエラーを防げる
  const categories: Category[] = data?.categories || [];

  return (
    <>
      <div className="p-7">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">カテゴリー一覧</h1>
          <Link href="/admin/categories/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            新規作成
          </Link>
        </div>

        {categories.map((category: Category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  )
}