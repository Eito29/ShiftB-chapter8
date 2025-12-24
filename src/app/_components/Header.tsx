"use client"

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex justify-between fixed top-0 p-6 font-bold bg-black text-white">
      <Link href="/">Blog</Link>
      <Link href="/contact">お問い合わせ</Link>
    </header>
  );
}
