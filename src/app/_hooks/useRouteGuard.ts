// useSupabaseSession を使って、
// 「ログインしていないユーザーを強制的にログイン画面へリダイレクトさせる（追い返す）」ためのカスタムフック

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useRouteGuard = () => {
  const router = useRouter()
  // セッション情報（ログイン状態）を取り出す
  const { session } = useSupabaseSession()

  useEffect(() => {
    // 【重要】セッションが undefined（ロード中）のときは、
    // まだログインしているか判断できないため、何もしない（処理を抜ける）
    if (session === undefined) return

    const fetcher = async () => {
      // セッションが null（未ログイン）であることが確定した場合
      if (session === null) {
        // ログイン画面（/login）に強制移動させる
        // .replace を使うことで、遷移後にブラウザの「戻る」で管理画面に戻れないようにする
        router.replace('/login')
      }
    }

    fetcher();
    // router または session の状態が変化するたびにこのチェックを実行する
  }, [router, session])
}