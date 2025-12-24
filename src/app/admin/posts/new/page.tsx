"use client"

import { Category } from "@/app/_types/Category";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNewPost() {
  const router = useRouter(); // 作成完了後に画面を移動させるために使用

  // --- ① State（箱）の準備 ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]); // プルダウンに並べる全カテゴリー
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // ユーザーが選んだカテゴリーID

  // --- ② 画面が開いた時の処理（useEffect） ---
  // ページが表示された瞬間に実行し、セレクトボックスの中身を準備する
  useEffect(() => {
    const getCategories = async() => {
      const res = await fetch("/api/admin/categories"); // カテゴリー一覧APIを叩く
      const data = await res.json();

      setAllCategories(data.categories); // 取得したカテゴリー配列をStateに入れる
    }
    getCategories();
  }, []);

  // --- ③ ボタンを押した時の処理（handleSubmit） ---
  const handleSubmit = async () => {
    // サーバーへデータを送る準備
    const res = await fetch(
      `/api/admin/posts`,
      {
        method: "POST", // 新規作成なのでPOSTメソッド
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            title,
            content,
            thumbnailUrl,
            // API側の期待するキー名 'categories' に合わせて送る
            categories: [{id: selectedCategoryId}] 
          }
        )
      }
    )

    if (res.ok) {
      // API側で「作成した記事のID」を返してくれる設計なので、それを受け取る
      const data = await res.json(); 
      alert("作成完了しました");

      // [重要] 作成したばかりの記事の「編集画面」へ自動で移動する
      // APIが返すレスポンス { status: 'OK', id: 123 } の形式に合わせて data.id を指定
      router.push(`/admin/posts/${data.id}`); 
    } else {
      alert("作成に失敗しました");
    }
  };

  // --- ④ 見た目（Return） ---
  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-6">記事作成</h1>

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
          
          {/* allCategoriesの中身を1つずつoptionタグに展開 */}
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          作成
        </button>
      </div>
    </div>
  );
}