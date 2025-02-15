import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const category = searchParams.get("category") || "";

  // Build the WHERE condition dynamically
  const where: Prisma.ArticleWhereInput = {
    AND: [
      {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      ...(category ? [{ category }] : []), // Conditionally add category filter
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
