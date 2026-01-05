import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/utils/supabase';

const prisma = new PrismaClient()

/////////////////////// 管理者_記事詳細取得API
export const GET = async ( request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // URLパラメータから記事IDを取得

  // ログイン判定
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id), // 文字列のIDを数値に変換して検索
      },
      include: { // 記事に関連付いているカテゴリー情報も深く辿って取得
        postCategories: {
          include: {
            category: {
              select: { // カテゴリーの全データではなくIDと名前のみをピックアップ
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // 成功時：取得した1件の記事データを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
};

/////////////////////// 管理者_記事更新API
// 記事の更新時にフロントエンドから送られてくるデータの型定義
interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[] // 更新後のカテゴリーIDリスト
  thumbnailImageKey: string
}

export const PUT = async ( request: NextRequest, { params }: { params: { id: string } }, ) => {
  const { id } = params;
  // リクエストボディから更新データを取り出す
  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody = await request.json();

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // 1. 記事本体（タイトル、内容、画像URL）を更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 2. 中間テーブル（記事とカテゴリーの紐付け）の更新
    // [重要ロジック] 差分を計算して更新するのは複雑なため、「一度全部消して、新しい内容で作り直す」手法をとる
    
    // ① 一旦、この記事に紐付いているカテゴリー接続を全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    // ② フロントから届いた新しいカテゴリーリストを1つずつループして再登録
    // [注意] SQLiteはcreateMany（一括作成）が使えないため、for文で個別にcreateを実行
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    // 更新完了した記事データを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
};

/////////////////////// 管理者_記事削除API
// DELETEという命名にすることで、DELETEメソッドのリクエスト時に実行される
export const DELETE = async ( request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  // ログイン判定
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // 指定されたIDの記事を削除
    // [注釈] Prismaの設定（onDelete: Cascadeなど）により、中間テーブルの紐付けも自動で消える設定が一般的
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
};