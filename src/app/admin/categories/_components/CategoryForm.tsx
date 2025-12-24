
// void 処理を実行するだけで、何か値を返したり（計算結果を戻したり）はしない意味
interface Props {
  mode: "new" | "edit",
  name: string,
  setName: (title: string) => void
  handleSubmit: () => void
  handleDelete?: () => void // ? は必須ではないという意味
  isLoading?: boolean // 送信中かどうか
}

// React.FC<Props> これはReactの部品であることを強調する丁寧な決まり文句
export const CategoryForm: React.FC<Props> = ({ mode, name, setName, handleSubmit, handleDelete, isLoading }) => {
  return (
    <>
      <div className="mb-6">
        <label className="font-bold">カテゴリー名</label><br />
        <input
          type="text"
          disabled={isLoading}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          {mode === 'new' ? '作成' : '更新'}
        </button>

        {mode === 'edit' && (
          <button onClick={handleDelete} disabled={isLoading} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
            削除
          </button>
        )}
      </div>
    </>
  );
}
