import { Category } from "./Category"

// 単体の記事の型
export type PostType = {
  id: number,
  title: string,
  content: string,
  thumbnailImageKey: string,
  createdAt: string,
  postCategories: { category: Category }[],
}

// APIレスポンス（GET /api/admin/posts/[id]）の型
export type PostResponse = {
  post: PostType;
};

// APIレスポンス（GET /api/admin/posts）の一覧用型
export type PostsResponse = {
  posts: PostType[];
}