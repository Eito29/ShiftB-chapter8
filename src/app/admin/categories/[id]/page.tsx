"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR, { useSWRConfig } from "swr";
import { authFetcher } from "@/app/_hooks/fetcher";

export default function AdminCategory() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig(); // キャッシュ更新用
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. useSWRでカテゴリーデータを取得
  const { data, error, isLoading: isDataLoading } = useSWR(
    token && id ? [`/api/admin/categories/${id}`, token] : null,
    authFetcher
  );

  // 2. 取得したデータをフォームの初期値にセット
  useEffect(() => {
    if (data?.category) {
      setName(data.category.name);
    }
  }, [data]);

  // ローディング中、もしくはエラー時の処理
  if (isDataLoading) return <div className="p-7">読み込み中...</div>;
  if (error) return <div className="p-7 text-red-500">データの取得に失敗しました</div>;

  /* 更新ボタン処理 (PUT) */
  const handleSubmit = async () => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token
        },
        // [ポイント] API側の受け取り型（UpdateCategoryRequestBody）が { name: string } なので
        // 単なる文字列ではなく、オブジェクト形式 { name } で送信する
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        // 一覧と自分自身のデータを再取得させる
        mutate(['/api/admin/categories', token]);
        mutate([`/api/admin/categories/${id}`, token]);
        alert("更新完了しました");
      } else {
        alert("更新に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  /* 削除ボタン処理 (DELETE) */
  const handleDelete = async () => {
    if (!token) return;
    setIsSubmitting(true);

    const isConfirmed = confirm("削除しますか？");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });

      if (res.ok) {
        mutate(['/api/admin/categories', token]); // 一覧キャッシュを消す
        alert("削除完了しました");
        router.push("/admin/categories");
      } else {
        alert("削除に失敗しました");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="p-7">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">カテゴリー編集</h1>
        </div>

        <CategoryForm mode="edit" name={name} setName={setName} handleSubmit={handleSubmit} handleDelete={handleDelete} isLoading={isSubmitting} />
      </div>
    </>
  );
};
