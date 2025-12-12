"use client"

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between p-6 font-bold bg-black text-white">
      <Link href="/">Blog</Link>
      <Link href="/contact">お問い合わせ</Link>
    </header>
  );
}
