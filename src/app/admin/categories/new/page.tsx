"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminNewCategory() {  
  const router = useRouter();
  const { token } = useSupabaseSession();

  // --- ① State（箱）の準備 ---
  const [name, setName] = useState(""); // 新規作成だから入力欄は空のためuseEffect不要
  const [isLoading, setIsLoading] = useState(false);

  // --- ③ 更新ボタンを押した時の処理（handleSubmit） ---
  const handleSubmit = async () => {
    // 未入力チェック
    // .trim()でスペースキーだけの入力を防げる
    if (!name.trim()) {
      alert("カテゴリー名を入力してください");
      return; // ここで処理を終了し、APIを叩かない
    }

    setIsLoading(true);
    
    try {
      if (!token) return;

      const res = await fetch(
        `/api/admin/categories`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: token,
           },
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
        setIsLoading(false);
      }
    } catch(err) {
      console.error(err);
      alert("通信エラーが発生しました");
      setIsLoading(false);
    }
  };

  // --- ④ 見た目（Return） ---
  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-6">カテゴリー作成</h1>

      <CategoryForm mode="new" name={name} setName={setName} handleSubmit={handleSubmit} isLoading={isLoading}/>
    </div>
  );
}