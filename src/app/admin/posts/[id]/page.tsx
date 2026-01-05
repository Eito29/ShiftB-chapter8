"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "../_components/PostForm";
import { useFetch } from "@/app/_hooks/useFetch";
import { PostResponse } from "@/app/_types/Post";

export default function AdminPost() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // useFetchから必要なものをすべて取り出す
  // token: 通信(PUT/DELETE)用, mutate: 画面更新用
  const { data, error, isLoading: isDataLoading, token, mutate } = useFetch<PostResponse>(
    id ? `/api/admin/posts/${id}` : null
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // 選択中カテゴリーIDの箱
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 取得したデータをフォームの初期値にセットする
  useEffect(() => {
    if (data?.post) {
      const post = data.post;
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);

      if (post.postCategories && post.postCategories.length > 0) {
        setSelectedCategoryId(post.postCategories[0].category.id);
      }
    }
  }, [data]); // SWRのdataが変化した時に実行

  /**
   * 削除ボタンを押した時の処理
   */
  const handleDelete = async () => {
    if (!token) return;
    setIsSubmitting(true);

    // ① 確認ダイアログを表示（OKならtrueが返る）
    const isConfirmed = confirm("削除しますか？");

    // キャンセルされたらここで処理を終了する
    if (!isConfirmed) return;

    // ② 実際の削除処理を実行
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    if (res.ok) {
      alert("削除完了しました");
      router.push("/admin/posts");
    } else {
      alert("削除に失敗しました");
      setIsSubmitting(false);
    }
  };

  if (isDataLoading) return <div className="p-7">読み込み中...</div>;
  if (error) return <div className="p-7">エラーが発生しました</div>;

  /**
   * 更新ボタンを押した時の処理
   */
  const handleSubmit = async () => {
    if (!token) return;
    setIsSubmitting(true);

    // selectedCategoryId が 0 以上の（有効な）時だけ配列に含め、
    // 未選択(0)の時は空の配列 [] を送るようにする
    const categoriesToSend = selectedCategoryId > 0 ? [{ id: selectedCategoryId }] : [];

    // サーバーの更新用API(PUT)を叩く
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: token
      },
      // 画面上の全データと、選択されたカテゴリーIDをJSONにして送信
      body: JSON.stringify({
        title,
        content,
        thumbnailImageKey,
        categories: categoriesToSend // 85行目参照
      }),
    });

    if (res.ok) {
      await mutate();
      alert("更新完了しました");
    } else {
      alert("更新に失敗しました");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}