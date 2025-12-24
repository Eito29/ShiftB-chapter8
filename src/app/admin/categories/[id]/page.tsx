"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminCategory() {
  const {id} = useParams<{id: string}>();
  const router = useRouter();

  const [name, setName] = useState("");

  // --- 画面表示時に現在のカテゴリー情報を取得 ---
  useEffect(() => {
    const getCategory = async() => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();

      // [ポイント] APIのレスポンスが { status: "OK", category: { name: "..." } } なので
      // data.category.name と指定して値を取り出す
      if (data.category) {
        setName(data.category.name);
      }
    }
    getCategory();
  }, [id]);

  /* 更新ボタン処理 (PUT) */
  const handleUpdate = async () => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // [ポイント] API側の受け取り型（UpdateCategoryRequestBody）が { name: string } なので
      // 単なる文字列ではなく、オブジェクト形式 { name } で送信する
      body: JSON.stringify({ name }), 
    });

    if (res.ok) {
      alert("更新完了しました");
    } else {
      alert("更新に失敗しました");
    }
  };

  /* 削除ボタン処理 (DELETE) */
  const handleDelete = async () => {
    const isConfirmed = confirm("削除しますか？");
    if (!isConfirmed) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("削除完了しました");
      router.push("/admin/categories");
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    <>
      <div className="p-7">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">カテゴリー編集</h1>
        </div>

        <div className="mb-6">
          <label className="font-bold">カテゴリー名</label><br />
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            更新
          </button>

          <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
            削除
          </button>
        </div>
      </div>
    </>
  );
}