// session: フロントエンド（React）側で、画面の表示を切り替えるための「フラグ」。
// token: バックエンド（API）側で、不正なアクセスを防ぐための「合言葉」。

import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      // ブラウザのストレージ（Cookieなど）に保存されている「ログインの記憶」を Supabase のライブラリが読み取り
      // ログインして成功していれば、session オブジェクトが返ってくる
      const { data: { session }, } = await supabase.auth.getSession();

      setSession(session) // session情報を保存（中身はユーザーIDや期限など）

      // sessionがあればその中のアクセストークンを、なければnullをセット
      setToken(session?.access_token || null);

      setIsLoading(false);
    }

    fetcher();
  }, []);

  // 他のコンポーネントで使えるように値を返す
  return { session, isLoading, token };
}