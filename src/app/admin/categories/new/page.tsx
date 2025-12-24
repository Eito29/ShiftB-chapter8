"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNewCategory() {
  const {id} = useParams();
  const router = useRouter();

  // --- ① State（箱）の準備 ---
  const [name, setName] = useState("");

  // --- ② 画面が開いた時の処理（useEffect） ---
  useEffect(() => {
    const getCategory = async() => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();

      setName(data.name);
    }
    getCategory();
  }, []);

  // --- ③ 更新ボタンを押した時の処理（handleSubmit） ---
  const handleSubmit = async () => {
    const res = await fetch(
      `/api/admin/categories`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name})
      }
    )

    if (res.ok) {
      const data = await res.json(); 
      alert("カテゴリーを作成しました");

      // APIが返すレスポンス { status: 'OK', id: 123 } の形式に合わせて data.id を指定
      router.push(`/admin/categories/${data.id}`); 
    } else {
      alert("カテゴリーの作成に失敗しました");
    }
  };

  // --- ④ 見た目（Return） ---
  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

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
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          作成
        </button>
      </div>
    </div>
  );
}