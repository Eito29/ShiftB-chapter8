// 「データを取るなら useFetch を使う」というルールだけで統一するためのカスタムフック
// コンポーネントがスッキリするようにするための工夫（useSWR や fetcher のインポート不要になる）
// （/api/admin）かどうかを判定させて「これは管理用だからトークンが必要だな」「これは公開用だから普通に取ろう」と判断してデータを返してくれるようにしている。

import useSWR from 'swr';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { fetcher, authFetcher } from '@/app/_hooks/fetcher';

// <T> はジェネリクス（型を後から決めれるようにするためのもの　いったんT(Type)にしとこう）
// 例えば、カテゴリーの時は CategoryResponse を流し込むイメージ
export const useFetch = <T>(url: string | null) => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();

  // 管理画面系のURL（/api/admin）かどうかを判定
  const isAdminUrl = url?.startsWith('/api/admin');

  // isAdminUrl が true の場合：token がある時だけ authFetcher を使う
  // isAdminUrl が false の場合：通常の fetcher を使う
  // 条件 ? 正解1 : 正解2
  const { data, error, isLoading, mutate } = useSWR<T>(
    isAdminUrl 
      ? (token && url ? [url, token] : null) // 認証ありのキー
      : url,                                  // 認証なしのキー
    isAdminUrl ? authFetcher : fetcher         // fetcherを切り替え
  );

  return {
    data,
    error,
    // isSessionLoading を入れることでログイン情報を調べている間も「読み込み中…」と表示する
    isLoading: (isAdminUrl ? isSessionLoading : false) || isLoading,
    token,
    mutate,
  };
};