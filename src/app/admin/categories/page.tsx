"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Category } from "@/app/_types/Category";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const { token } = useSupabaseSession();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!token) return;

    const getCategories = async() => {
      const res = await fetch(
        "/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        }
      );
      const data = await res.json();

      setCategories(data.categories);
    }
    getCategories();
  }, [token]);

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