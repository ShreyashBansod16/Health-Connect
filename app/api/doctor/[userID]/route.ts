import { NextResponse } from "next/server"
import prisma from "@/utils/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
  }

  try {
    const query = {
      where: {
        userId: userId,
        ...(start && end
          ? {
              date: {
                gte: new Date(start),
                lte: new Date(end),
              },
            }
          : {}),
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
          },
        },
      },
    }

    const appointments = await prisma.appointment.findMany(query)

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date.toISOString().split("T")[0],
      time: appointment.time,
      doctor: {
        id: appointment.doctorId,
        name: appointment.doctor.name,
        specialization: appointment.doctor.specialization,
      },
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, date, time, doctorId } = body

    // Validate required fields
    if (!userId || !date || !time || !doctorId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["userId", "date", "time", "doctorId"],
        },
        { status: 400 },
      )
    }

    // Validate doctor exists
    const doctorExists = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctorExists) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        date: new Date(date),
        time,
        doctorId,
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: appointment.id,
      date: appointment.date.toISOString().split("T")[0],
      time: appointment.time,
      doctor: {
        id: appointment.doctorId,
        name: appointment.doctor.name,
        specialization: appointment.doctor.specialization,
      },
    })
  } catch (error) {
    console.error("Error creating appointment:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}

