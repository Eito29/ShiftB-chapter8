"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { PostForm } from "../_components/PostForm";

export default function AdminNewPost() {
  const router = useRouter(); // 作成完了後に画面を移動させるために使用
  const { token } = useSupabaseSession();

  // --- ① State（箱）の準備 ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // ユーザーが選んだカテゴリーID
  const [isLoading, setIsLoading] = useState(false);

  // --- ③ ボタンを押した時の処理（handleSubmit） ---
  const handleSubmit = async () => {
    if (!token) return;

    // 未入力チェック
    // .trim()でスペースキーだけの入力を防げる
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return; // ここで処理を終了し、APIを叩かない
    }

    setIsLoading(true);

    const categoriesToSend = selectedCategoryId > 0 ? [{ id: selectedCategoryId }] : [];

    // サーバーへデータを送る準備
    const res = await fetch(
      `/api/admin/posts`,
      {
        method: "POST", // 新規作成なのでPOSTメソッド
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(
          {
            title,
            content,
            thumbnailImageKey,
            categories: categoriesToSend
          }
        )
      }
    )

    if (res.ok) {
      // API側で「作成した記事のID」を返してくれる設計なので、それを受け取る
      const data = await res.json(); 
      alert("作成完了しました");
      setIsLoading(false);
      // [重要] 作成したばかりの記事の「編集画面」へ自動で移動する
      // APIが返すレスポンス { status: 'OK', id: 123 } の形式に合わせて data.id を指定
      router.push(`/admin/posts/${data.id}`); 
    } else {
      alert("作成に失敗しました");
      setIsLoading(false);
    }
  };

  // --- ④ 見た目（Return） ---
  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-6">記事作成</h1>
      
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}