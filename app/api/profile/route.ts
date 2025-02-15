import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ isNewUser: true }, { status: 200 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fullName, username, website } = body;

    if (!userId || !fullName || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        fullName,
        username,
        website,
        updatedAt: new Date(),
      },
      create: {
        userId,
        fullName,
        username,
        website,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}