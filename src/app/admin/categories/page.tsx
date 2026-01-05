"use client"

import { useFetch } from "@/app/_hooks/useFetch";
import { CategoriesResponse, Category } from "@/app/_types/Category";
import Link from "next/link";

export default function AdminCategories() {
  const { data, isLoading, error } = useFetch<CategoriesResponse>("/api/admin/categories");

  // データが届く前は空配列 [] になるようにしておくとエラーを防げる
  const categories = data?.categories || [];

  if (isLoading) return <div className="p-7">読み込み中…</div>;
  if (error) return <div className="p-7 text-red-500">エラーが発生しました</div>;

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