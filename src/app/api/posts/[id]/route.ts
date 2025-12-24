// GET（取得）: findUnique を使う。「1つ見つけて！」という命令
// PUT（更新）: update を使う。「中身を書き換えて！」という命令
// DELETE（削除）: delete を使う。「消しちゃって！」という命令
// where: すべての命令に where: { id: Number(id) } がついているのは、「どの記事に対して操作するか」をハッキリさせるため。これを忘れるとDBがパニックになるから大事！

import { NextRequest, NextResponse } from "next/server";
import { main } from "../route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 詳細取得用API（GET）
 * URLにあるIDを使って、特定の記事を1つだけ取ってくる
 */
export const GET = async(req: NextRequest, { params }: { params: {id: string}}) => { 
  try {
    // 修正ポイント：文字列の id を数値（Number）に変換する
    const postId = Number(params.id);

    const post = await prisma.post.findUnique({
      where: { 
        id: postId  // 数値に変換した変数を使う
      },
      include: {
        postCategories: {
          include: {
            category: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ message: "記事が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ message: "成功", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "エラー", err }, { status: 400 });
  }
};

/**
 * 編集用API（PUT）
 * 既存の記事の中身を書き換える
 */
export const PUT = async(req: NextRequest, { params }: { params: {id: string}}) => {
  try {
    const { id } = params; // どの記事を直すかIDをキャッチ
    await main();

    const {title, content, thumbnailUrl, postCategories} = await req.json(); // 画面から送られてきた新しいタイトルと内容を受け取る
    
    // 指定したIDの記事を、新しいデータで「更新（update）」する
    const post = await prisma.post.update({
      data: { 
        title,
        content,
        thumbnailUrl,
        postCategories: {
          // ① 今紐付いているカテゴリーを一旦すべて解除（削除）する
          deleteMany: {}, 
          // ② 画面から送られてきたカテゴリーIDで新しく紐付け直す
          create: postCategories.map((pc: { id: number }) => ({
            categoryId: pc.id,
          })),
        },
      }, // ここのデータに書き換える
      where: { id: Number(id) } // このIDの記事が対象
    });

    return NextResponse.json({message: "成功", post}, {status: 200});
  } catch (err){
    return NextResponse.json({message: "エラー", err}, {status: 400})
  };
};

/**
 * 削除用API（DELETE）
 * いらなくなった記事をDBから消し去る
 */
export const DELETE = async(req: NextRequest, { params }: { params: {id: string}}) => {
  try {
    const { id } = params; // 消したい記事のIDを受け取る
    await main();

    // 指定したIDの記事を「削除（delete）」する
    const post = await prisma.post.delete({
      where: { id: Number(id) } // このIDの記事を消してね
    });

    return NextResponse.json({message: "成功", post}, {status: 200});
  } catch (err){
    return NextResponse.json({message: "エラー", err}, {status: 400})
  };
};