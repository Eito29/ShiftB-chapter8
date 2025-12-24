import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/////////////////// 管理者_カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({status: 'OK', categories: categories}, {status: 200});
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400});
  };
};

/////////////////// 管理者_カテゴリー新規作成API
// カテゴリー作成のリクエストボディの型
interface CreateRequestCategory {
  name: string
}

export const POST = async (request: NextRequest, context: any) => {
  try {
    const body = await request.json();
    const { name }: CreateRequestCategory = body;
    const data = await prisma.category.create({
      data: {
        name
      }
    });

    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id
    });
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400});
  };
};