import { NextResponse } from "next/server"
import prisma from "@/utils/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
      include: {
        doctor: {
          select: { name: true },
        },
      },
    })

    const formattedRecords = medicalRecords.map((record) => ({
      id: record.id,
      date: record.date.toISOString().split("T")[0],
      title: record.title,
      description: record.description,
      doctorName: record.doctor.name,
    }))

    return NextResponse.json(formattedRecords)
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, doctorId, date, title, description } = await request.json()

    if (!userId || !doctorId || !date || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        userId,
        doctorId,
        date: new Date(date),
        title,
        description,
      },
      include: {
        doctor: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({
      id: medicalRecord.id,
      date: medicalRecord.date.toISOString().split("T")[0],
      title: medicalRecord.title,
      description: medicalRecord.description,
      doctorName: medicalRecord.doctor.name,
    })
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
  }
}


