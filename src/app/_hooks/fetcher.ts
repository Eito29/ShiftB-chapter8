// SWR化に伴い、fetcher関数を分離して共通化

// 1. 誰でも見れるデータ用
export const fetcher = (url: string) => 
  fetch(url).then(res => res.json());

// 2. 認証が必要なデータ用
export const authFetcher = ([url, token]: [string, string]) => 
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  }).then(res => res.json());