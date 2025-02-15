import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    // Extract articleId from the URL
    const urlParts = request.url.split("/");
    const articleId = urlParts[urlParts.length - 2]; // Assuming the ID is before 'comments'

    if (!articleId) {
        return NextResponse.json(
            { success: false, error: "Article ID is required" },
            { status: 400 }
        );
    }

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
                articleId,
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

export async function GET(request: Request) {
    // Extract articleId from the URL
    const urlParts = request.url.split("/");
    const articleId = urlParts[urlParts.length - 2]; // Assuming the ID is before 'comments'

    if (!articleId) {
        return NextResponse.json(
            { success: false, error: "Article ID is required" },
            { status: 400 }
        );
    }

    console.log("GET request received for article:", articleId);

    try {
        const comments = await prisma.comment.findMany({
            where: {
                articleId,
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
