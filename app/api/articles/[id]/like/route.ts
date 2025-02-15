import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const { id: articleId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
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

    // Check if the user has already liked the article
    const existingLike = await prisma.like.findFirst({
      where: {
        articleId: articleId,
        userId: profile.userId,
      },
    });

    if (existingLike) {
      // If like exists, remove it (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Get updated likes count
      const updatedLikes = await prisma.like.findMany({
        where: { articleId: articleId },
        include: {
          user: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        data: updatedLikes,
        message: "Like removed",
      });
    }

    // Create new like
    const newLike = await prisma.like.create({
      data: {
        articleId: articleId,
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

    // Get all likes including the new one
    const allLikes = await prisma.like.findMany({
      where: { articleId: articleId },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      liked: true,
      data: allLikes,
      message: "Like added",
    });

  } catch (error) {
    console.error("Failed to process like:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process like" },
      { status: 500 }
    );
  }
}