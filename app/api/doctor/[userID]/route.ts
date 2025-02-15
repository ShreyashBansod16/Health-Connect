import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma"; // Adjust path as per your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "User ID is required and must be a string" });
      }

      // Fetch appointments for the given user ID
      const appointments = await prisma.appointment.findMany({
        where: { userId },
        select: {
          date: true,  // Select only the `date` field for now
        },
      });

      // Map and format dates to ISO strings
      const formattedAppointments = appointments.map((appointment) => ({
        date: appointment.date.toString(),
      }));

      return res.status(200).json(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

