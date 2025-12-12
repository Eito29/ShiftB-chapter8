"use client"

export type Post = {
  id: number,
  title: string,
  thumbnailUrl: string,
  createdAt: string,
  categories: string[],
  content: string
}
