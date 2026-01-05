// src/app/_hooks/useFetch.ts
import useSWR from 'swr';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

// 認証が必要なデータ取得用のフェッチャー（このファイル内でのみ使用）
const authFetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token, // サーバー側の仕様に合わせて `Bearer ${token}` にする場合もあり
    },
  });
  if (!res.ok) throw new Error('通信エラー');
  return res.json();
};

export const useFetch = <T>(url: string | null) => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();

  // キーに [url, token] を渡すことで、トークンがある時だけ authFetcher が走る
  const { data, error, isLoading, mutate } = useSWR<T>(
    token && url ? [url, token] : null,
    authFetcher
  );

  return {
    data,
    error,
    isLoading: isSessionLoading || isLoading,
    mutate,
  };
};