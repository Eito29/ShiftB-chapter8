'use client'

import { supabase } from '@/utils/supabase'
import { useState } from 'react'

export default function Page() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // フォーム送信時の処理
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // 画面リロード（標準のブラウザ動作）を防止

    // SupabaseのAuth機能を使ってユーザー登録を実行
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // メールのリンクをクリックした後の戻り先URLを指定
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })

    if (error) {
      alert('登録に失敗しました')
    } else {
      // 登録成功時：入力欄を空にして、確認メールの案内を出す
      setEmail('')
      setPassword('')
      alert('確認メールを送信しました。')
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            メールアドレス
          </label>
          <input
            type="email"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            パスワード
          </label>
          <input
            type="password"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}