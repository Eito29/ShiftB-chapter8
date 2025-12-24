"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  // 1. 現在表示されているページのパスを取得（例: "/admin/posts"）
  const pathname = usePathname(); 

  // 2. 選択判定用の関数
  // 引数の href が現在のURLに含まれているかチェックし、true/false を返す
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <>
      <aside className="w-[280px] fixed top-[72px] left-0 bottom-0 bg-gray-200">

        {/* isSelected が true の時だけ 'bg-blue-100' が適用される */}
        <Link 
          href="/admin/posts"
          className={`block py-5 px-3 hover:bg-blue-100
            ${isSelected('/admin/posts') && 'bg-blue-100'}
          `}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`block py-5 px-3 hover:bg-blue-100
            /* 記事一覧と同様の判定ロジック */
            ${isSelected('/admin/categories') && 'bg-blue-100'}
          `}
        >
          カテゴリー一覧
        </Link>
      </aside>

      <div className="ml-[280px] pt-[72px]">
        {children}
      </div>
    </>
  );
}