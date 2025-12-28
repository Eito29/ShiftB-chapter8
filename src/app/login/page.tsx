'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // ログイン成功後の移動に使用
  const router = useRouter()

  // 「ログイン」が押された時の処理
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({ // signInWithPassword→ログインさせるための専用の「決まった名前の関数」
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      // ログイン成功時：管理画面の記事一覧ページへ遷移
      // .replace を使うことで、戻るボタンでログイン画面に戻れないようにする認証画面でよく使われるテクニック
      router.replace('/admin/posts')
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
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}