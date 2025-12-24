// admin/page.tsx
// ここは管理画面のトップではなく「管理画面の入り口」として考える
// 将来ダッシュボードを作りたいなどの拡張性に優れている
// また、URLの意味としても/postsの方が記事一覧と認識しやすい

import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/posts')
}
