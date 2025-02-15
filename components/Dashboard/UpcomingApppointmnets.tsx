"use client"

import type { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Appointment {
  id: string
  date: string
  time: string
  doctorName: string
}

const fetchUpcomingAppointments = async (userId: string) => {
  const response = await fetch(`/api/doctor?userId=${userId}&upcoming=true`)
  if (!response.ok) throw new Error("Failed to fetch upcoming appointments")
  return response.json()
}

export default function UpcomingAppointments({ user }: { user: User }) {
  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcomingAppointments", user.id],
    queryFn: () => fetchUpcomingAppointments(user.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) return <div>Loading upcoming appointments...</div>
  if (error) return <div>Error loading upcoming appointments</div>

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments && appointments.length > 0 ? (
          <ul className="space-y-2">
            {appointments.map((appointment: Appointment) => (
              <motion.li
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {format(new Date(`${appointment.date}T${appointment.time}`), "PPpp")}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Dr. {appointment.doctorName}</p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No upcoming appointments</p>
        )}
      </CardContent>
    </Card>
  )
}

