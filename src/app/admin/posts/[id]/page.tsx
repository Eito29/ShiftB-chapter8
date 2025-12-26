"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "../_components/PostForm";

export default function AdminPost() {
  const { id } = useParams<{ id: string }>(); // パラメーターからid取得
  const router = useRouter(); // 画面移動（リダイレクト）のために使う

  // 各入力項目の状態（State）
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // 選択中カテゴリーIDの箱
  const [isLoading, setIsLoading] = useState(false);

  // 1. 最初にデータを読み込む（表示用）
  useEffect(() => {
    if (!id) return; // ← id 未確定ガード（不具合防止）
    const fetchPost = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const data = await res.json();

      // 1. 記事の各項目をセット
      const post = data.post; // dataの中にあるpostオブジェクトを取り出す
      setTitle(post.title); // タイトルをセット
      setContent(post.content); // 内容をセット
      setThumbnailUrl(post.thumbnailUrl); // サムネイルURLをセット

      // 2. 最後に「どれを選ぶか」をセットする
      if (post.postCategories && post.postCategories.length > 0) {
        // 記事が現在持っているカテゴリーのIDをセット。これで「カテゴリ1」などが正しく選ばれる
        setSelectedCategoryId(post.postCategories[0].categoryId);
      }
    };
    fetchPost();
  }, [id]); // idが変わるたびに再実行

  /**
   * 削除ボタンを押した時の処理
   */
  const handleDelete = async () => {
    // ① 確認ダイアログを表示（OKならtrueが返る）
    const isConfirmed = confirm("削除しますか？");

    // キャンセルされたらここで処理を終了する
    if (!isConfirmed) return;

    // ② 実際の削除処理を実行
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE", // 削除リクエスト
    });

    if (res.ok) {
      // ③ 削除完了の通知を出す
      alert("削除完了しました");
      setIsLoading(false);
      // ④ OKを押した後に一覧画面へ移動する
      router.push("/admin/posts");
    } else {
      alert("削除に失敗しました"); // エラー時の通知
      setIsLoading(false);
    }
  };

  /**
   * 更新ボタンを押した時の処理
   */
  const handleSubmit = async () => {
    // サーバーの更新用API(PUT)を叩く
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT", // 更新リクエスト
      headers: { "Content-Type": "application/json" }, // JSON形式であることを伝える
      // 画面上の全データと、選択されたカテゴリーIDをJSONにして送信
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: [{ id: selectedCategoryId }] // APIが期待する { id: number }[] の形式に合わせる
      }),
    });

    if (res.ok) {
      alert("更新完了しました"); // 成功時の通知
      setIsLoading(false);
    } else {
      alert("更新に失敗しました"); // 失敗時の通知
      setIsLoading(false);
    }
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
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}