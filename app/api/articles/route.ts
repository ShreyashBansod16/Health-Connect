import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const category = searchParams.get("category") || "";

  const where: Prisma.ArticleWhereInput = {
    AND: [
      {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      ...(category ? [{ category }] : []),
    ],
  };

  const articles = await prisma.article.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      likes: true,
      comments: true,
    },
  });

  const total = await prisma.article.count({ where });

  return NextResponse.json({ articles, total });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, image, tags, authorId } = body;
console.log(authorId)
    if (!title || !excerpt || !content || !category || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        excerpt,
        content,
        category,
        image,
        tags,
        authorId, // Correctly using userId from request body
      },
    });

    return NextResponse.json({ data: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
