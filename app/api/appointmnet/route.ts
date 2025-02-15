import { NextResponse } from "next/server"
import prisma from "@/utils/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const doctorId = searchParams.get("doctorId")

  try {
    let query = {}

    if (doctorId) {
      query = { where: { id: doctorId } }
    }

    const doctors = await prisma.doctor.findMany(query)

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, specialization } = await request.json()

    if (!name || !specialization) {
      return NextResponse.json({ error: "Name and specialization are required" }, { status: 400 })
    }

    const doctor = await prisma.doctor.create({
      data: { name, specialization },
    })

    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error creating doctor:", error)
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 })
  }
}

