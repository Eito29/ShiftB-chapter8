'use client'

import { supabase } from '@/utils/supabase'
import { useForm, SubmitHandler } from "react-hook-form"
import { formSchema } from '../_components/FormSchema'
import { zodResolver } from '@hookform/resolvers/zod'

type Inputs = {
  email: string
  password: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
    reset, // フォームをリセットするために追加
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ resolver: zodResolver(formSchema) })

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })

    if (error) {
      alert('登録に失敗しました: ' + error.message)
    } else {
      alert('確認メールを送信しました。')
      reset() // フォームの入力欄を空にする
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="name@company.com"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting} // 送信中はボタンを無効化
            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}