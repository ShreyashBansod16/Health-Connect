import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle POST request to like/unlike an article
export async function POST(request: Request) {
    
    // Extract articleId from the URL
    const urlParts = request.url.split("/"); 
    const articleId = urlParts[urlParts.length - 2]; // Assuming the ID is before 'like'
    


    if (!articleId) {
        return NextResponse.json(
            { success: false, error: "Article ID is required" },
            { status: 400 }
        );
    }

    try {
        const { userId } = await request.json();
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
            where: { articleId, userId: profile.userId },
        });

        if (existingLike) {
            // Unlike the article
            await prisma.like.delete({
                where: { id: existingLike.id },
            });

            // Get updated likes count
            const updatedLikes = await prisma.like.findMany({
                where: { articleId },
                include: { user: { select: { username: true, avatarUrl: true } } },
            });

            return NextResponse.json({
                success: true,
                liked: false,
                data: updatedLikes,
                message: "Like removed",
            });
        }

        // Add a new like
        const newLike = await prisma.like.create({
            data: { articleId, userId: profile.userId },
            include: { user: { select: { username: true, avatarUrl: true } } },
        });

        console.log("New like added:", newLike);

        // Get all likes
        const allLikes = await prisma.like.findMany({
            where: { articleId },
            include: { user: { select: { username: true, avatarUrl: true } } },
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
