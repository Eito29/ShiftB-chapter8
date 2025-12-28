import { Category } from "./Category"

export type PostType = { // 1記事の型
  id: number,
  title: string,
  content: string,
  thumbnailImageKey: string,
  createdAt: string,
  postCategories: { category: Category }[],
}
