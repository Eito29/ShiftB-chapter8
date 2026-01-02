"use client"

// この共通パーツがないと、
// 新規作成ページと編集ページの両方に「タイトル入力欄」「カテゴリー取得処理」「削除ボタンの見た目」などを
// 書かなければいけなくなり、
// 修正が必要になったときに2箇所直す手間が発生してしまう。

// 記事を作成・編集するために必要なすべての入力要素を管理
// どの画面（新規・編集）でPostFormを呼び出しても、カテゴリー一覧が表示される

import { Category } from "@/app/_types/Category";
import { ChangeEvent, useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from "next/image";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (value: string) => void;
  selectedCategoryId: number;
  setSelectedCategoryId: (id: number) => void;
  handleSubmit: () => void;
  handleDelete?: () => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<Props> = ({
    mode,
    title,
    setTitle,
    content,
    setContent,
    thumbnailImageKey,
    setThumbnailImageKey,
    selectedCategoryId,
    setSelectedCategoryId,
    handleSubmit,
    handleDelete,
    isLoading
  }) => {

  const { token } = useSupabaseSession();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  useEffect(() => {
    if (!token) return;

    const getCategories = async () => {
      const res = await fetch(
        "/api/admin/categories",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        }
      ); // カテゴリー一覧APIを叩く
      const data = await res.json();

      setAllCategories(data.categories); // 取得したカテゴリー配列をStateに入れる
    }
    getCategories();
  }, [token]);

  useEffect(() => {
    if (!thumbnailImageKey) return
    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  // 画像アップロード処理
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>, // ① 変化（ファイル選択）が起きた時の情報を受け取る
  ) : Promise<void> => {

  if (!event.target.files || event.target.files.length == 0) {
    // 画像が選択されていないのでreturn
    return
  }

  // 選択された複数のファイルの中から「最初の1つ目」を取り出す
  const file = event.target.files[0];

  // 保存先のフォルダ名と、被らない名前（UUID）を組み合わせてパスを作る
  // 例: "private/a1b2c3d4-..." という文字列になる
  const filePath = `private/${uuidv4()}`; // ファイルパスを指定

  // Supabaseに画像をアップロード
  const { data, error } = await supabase.storage
    .from('post_thumbnail') // バケット名
    .upload(filePath, file, { //「どこに(filePath)」「何を(file)」送るか指定
      cacheControl: '3600',   // ブラウザに「3600秒間はキャッシュしていいよ」と指示
      upsert: false,          // 同じ名前があっても上書きしない（false）
    });

  // アップロードに失敗したらエラーを表示して終了
  if (error) {
    alert(error.message);
    return;
  }

  // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
  setThumbnailImageKey(data.path);
}

  return (
    <>
      <div className="mb-6">
        <label className="font-bold">タイトル</label><br />
        <input
          type="text"
          value={title} // Stateの値を表示に反映（双方向データバインディング）
          onChange={(e) => setTitle(e.target.value)} // 文字が入力されるたびにStateを更新
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="font-bold">内容</label><br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 relative w-full h-[400px]">
        <label htmlFor="thumbnailImageKey" className="font-bold">サムネイルURL</label><br />
        <input
          type="file"
          id="thumbnailImageKey"
          accept="image/*" // 画像ファイルのみ選択可能にする
          onChange={handleImageChange}
          className="w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {thumbnailImageUrl && (
          <Image src={thumbnailImageUrl} fill className="object-cover" alt="サムネイル" />
        )}
      </div>

      <div className="mb-6">
        <label className="font-bold">カテゴリー</label><br />
        <select
          value={selectedCategoryId}
          // セレクトボックスの値は文字列で届くため、Number()で数値に変換してStateへ保存
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

          <option value={0}></option>

          {/* allCategoriesの中身を1つずつoptionタグに展開 */}
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-6 py-2 rounded transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
        >
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`bg-red-600 text-white px-6 py-2 rounded transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
              }`}
          >
            削除
          </button>
        )}
      </div>
    </>
  )
}