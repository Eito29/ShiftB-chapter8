import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// DBを操作する道具（プリズマ）を準備。これを使って命令を出す
const prisma = new PrismaClient();

/**
 * 一覧取得API（GET）
 * フロントから「記事一覧ちょうだい」と言われたら動く
 */
export const GET = async() => {
  try {
    const posts = await prisma.post.findMany({ // postテーブルのデータを全部持ってくる
      // ここが重要：中間テーブルとその先のカテゴリを合体させて取得する
      include: {
        postCategories: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: "desc" } // 新しい順に並べる
    });

    // Postmanの結果に合わせて、{ posts } という名前で返す
    return NextResponse.json({message: "成功", posts}, {status: 200});
  } catch (err){
    return NextResponse.json({message: "エラー", err}, {status: 400})
  }
};

/**
 * 投稿API（POST）
 * 新しく記事を書きたい時に、タイトルと内容を受け取ってDBに保存する
 */
export const POST = async(req: NextRequest) => {
  try {
    const { title, content, thumbnailImageKey} = await req.json(); // 画面から送られてきたタイトルと内容を取り出す
    
    // DBに新しいデータを作る（作成したデータが post に入る）
    const post = await prisma.post.create({ 
      data: {
        title, 
        content,
        thumbnailImageKey
      }
    }); 

    return NextResponse.json({message: "成功", post}, {status: 201}); // 保存したデータを返してあげる
  } catch (err){
    return NextResponse.json({message: "エラー", err}, {status: 400})
  }
};