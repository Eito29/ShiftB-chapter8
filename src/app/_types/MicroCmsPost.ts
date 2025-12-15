export type MicroCmsPost = { // 1記事の型
  id: string,
  title: string,
  thumbnail: { url: string; height: number; width: number},
  createdAt: string,
  categories: {id: string; name: string}[],
  content: string
}
