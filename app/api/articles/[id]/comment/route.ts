import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Correct type for dynamic route parameters
interface Context {
  params: { id: string };
}

export async function POST(request: Request, context: Context) {
  try {
    const { id } = context.params;
    const { content, userId } = await request.json();

    if (!content || !userId) {
      return NextResponse.json(
        { success: false, error: "Content and userId are required" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: id,
        userId: profile.userId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// ✅ Fixed GET handler
export async function GET(request: Request, context: Context) {
  try {
    const { id: articleId } = context.params; // ✅ Corrected

    const comments = await prisma.comment.findMany({
      where: { articleId, parentId: null },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
