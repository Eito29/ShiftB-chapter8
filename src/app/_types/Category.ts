// 単体のカテゴリー型
export type Category = {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string
}

// APIレスポンス（GET /api/admin/categories/[id]）の型
export type CategoryResponse = {
  category: Category;
};

// APIレスポンス（GET /api/admin/categories）の一覧用型
export type CategoriesResponse = {
  categories: Category[];
};