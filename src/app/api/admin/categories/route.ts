import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/utils/supabase';

const prisma = new PrismaClient()

/////////////////// 管理者_カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  // ログイン判定
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
  
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

export const POST = async (request: NextRequest) => {
  // ログイン判定
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
  
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