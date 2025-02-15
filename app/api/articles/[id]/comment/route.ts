import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle POST request to add a comment
export async function POST(
  request: Request,
  { params }: { params: { id: string } } // ✅ Corrected context destructuring
) {
  try {
    const { content, userId } = await request.json();
    console.log("Received content:", content, "User ID:", userId);

    if (!content || !userId) {
      return NextResponse.json(
        { success: false, error: "Content and userId are required" },
        { status: 400 }
      );
    }

    // Check if the user profile exists
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Create a new comment
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: params.id, // ✅ Using correctly destructured params
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

// Handle GET request to fetch comments for an article

export async function GET(
  request: Request,

  { params }: { params: { id: string } } // ✅ Corrected context destructuring
) {
  console.log("GET request received for article:", params.id);



  try {
    const comments = await prisma.comment.findMany({
      where: { 
        articleId: params.id,
        parentId: null, 
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { 
        createdAt: "desc",
      },
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
