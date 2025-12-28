import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/utils/supabase';

const prisma = new PrismaClient();

/////////////////////// 【　管理者_記事一覧取得API　】
export const GET = async (request: NextRequest) => {
  // リクエストヘッダーからtokenを取得
  // ?? ''（Null合体演算子） 左側が空っぽなら、右側の空文字（''）を使う
  const token = request.headers.get('Authorization') ?? ''

	// supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) 
    return NextResponse.json({ status: error.message }, { status: 400 })

  // tokenが正しい場合、以降が実行される
  try {
    // 全ての記事を取得する
    const posts = await prisma.post.findMany({
      include: { // 関連するデータ（カテゴリー）も一緒に持ってくる
        postCategories: { // 記事とカテゴリーを繋ぐ中間テーブルを含める
          include: {
            category: { // さらにその先のカテゴリー詳細（名前など）を含める
              select: { // カテゴリーの中から必要な項目だけを抽出
                id: true, // IDを取得
                name: true, // カテゴリー名を取得
              },
            },
          },
        },
      },
      orderBy: { // 並び順を指定
        createdAt: 'desc', // 作成日時が新しい順（降順）にする
      },
    })

    // 成功時：status 'OK' と共に取得した記事一覧を返す
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

/////////////////////// 【　管理者_記事新規作成API　】
// 記事作成のリクエストボディの型（フロントエンドから送られてくるデータの形を定義）
interface CreatePostRequestBody {
  title: string,
  content: string,
  categories: { id: number }[], // 送られてくるカテゴリーはIDの配列
  thumbnailImageKey: string
}

// POSTという命名にすることで、POSTリクエスト（作成リクエスト）の時にこの関数が呼ばれる
export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';
  const { error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // リクエストのbody（JSON形式のデータ）を取得
    const body = await request.json()

    // bodyの中から各項目を分割代入で取り出す（型をCreatePostRequestBodyに合わせる）
    const { title, content, categories, thumbnailImageKey }: CreatePostRequestBody = body

    // 1. 投稿（Postテーブル）をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 2. 記事とカテゴリーの中間テーブル（PostCategoryテーブル）のレコードをDBに生成
    // [注意] 本来はcreateManyという一括保存メソッドがあるが、
    // 使用しているSQLiteではcreateManyが使えないため、for文で1つずつ実施する
    for (const category of categories) {
      if (category.id === 0) continue; // IDが0（未選択）でも通るため
      await prisma.postCategory.create({
        data: {
          categoryId: category.id, // フロントから届いたカテゴリーID
          postId: data.id, // 上記の1で生成された新しい記事のID
        },
      })
    }

    // 作成成功のレスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id, // フロント側で詳細画面へ遷移させるために、新しく作ったIDを返す
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}