import { Category } from "./Category"

export type PostType = { // 1記事の型
  id: number,
  title: string,
  content: string,
  thumbnailUrl: string,
  createdAt: string,
  postCategories: { category: Category }[],
}
