"use client"

import { Category } from "@/app/_types/Category";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (value: string) => void;
  selectedCategoryId: number;
  setSelectedCategoryId: (id: number) => void;
  allCategories: Category[]; // 親からカテゴリー一覧をもらう
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
  thumbnailUrl,
  setThumbnailUrl,
  selectedCategoryId,
  setSelectedCategoryId,
  allCategories,
  handleSubmit,
  handleDelete,
  isLoading
  }) => {

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

      <div className="mb-6">
        <label className="font-bold">サムネイルURL</label><br />
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          className={`bg-blue-600 text-white px-6 py-2 rounded transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`bg-red-600 text-white px-6 py-2 rounded transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            削除
          </button>
        )}
      </div>
    </>
  )
}