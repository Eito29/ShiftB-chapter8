"use client"

import Link from "next/link";
import React from 'react'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '@/utils/supabase'

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut() // ログアウト決まり文句
    window.location.href = '/'
  }

  // カスタムhook(app/_hooks/useSupabaseSession.ts)からsessionとisLoadingを取り出す
  const { session, isLoading } = useSupabaseSession()

  return (
    <header className="w-full flex justify-between fixed top-0 p-6 font-bold bg-black text-white">
      <Link href="/">Blog</Link>

      {!isLoading && ( // 「ログイン状態の読み込み中」は何も表示しないようにするため（画面ちらつき防止）
        <div className="flex items-center gap-4">
          {/* sessionがあれば表示 */}
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
