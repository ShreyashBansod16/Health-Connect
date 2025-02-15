"use client"

import { useState, useMemo } from "react"
import type { User } from "@supabase/supabase-js"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  doctorName: string
}

const fetchAppointments = async (userId: string, start: string, end: string) => {
  const response = await fetch(`/api/doctor?userId=${userId}&start=${start}&end=${end}`)
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export default function AppointmentCalendar({ user }: { user: User }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { start, end } = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return { start, end }
  }, [currentDate])

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", user.id, start.toISOString(), end.toISOString()],
    queryFn: () => fetchAppointments(user.id, start.toISOString(), end.toISOString()),
    select: (data) =>
      data.map((appointment: any) => ({
        id: appointment.id,
        title: `Appointment with Dr. ${appointment.doctor.name}`,
        start: new Date(`${appointment.date}T${appointment.time}`),
        end: new Date(`${appointment.date}T${appointment.time}`),
        doctorName: appointment.doctor.name,
      })),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  const CustomToolbar = ({ onNavigate, label }: any) => {
    return (
      <div className="flex justify-between items-center mb-4 sm:mb-6 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => {
              onNavigate("PREV")
              handleNavigate(subMonths(currentDate, 1))
            }}
            className="p-1 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => {
              onNavigate("NEXT")
              handleNavigate(addMonths(currentDate, 1))
            }}
            className="p-1 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="text-center">
          <span className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>
        <button
          onClick={() => {
            handleNavigate(new Date())
          }}
          className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Today
        </button>
      </div>
    )
  }

  const eventStyleGetter = (event: Appointment) => {
    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
      className: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md px-2 py-1",
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 px-2 sm:px-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Loading appointments...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-lg text-red-600 dark:text-red-300">Error loading appointments. Please try again later.</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-lg shadow-sm">
          <Calendar
            localizer={localizer}
            events={appointments || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "500px" }}
            views={["month"]}
            defaultView="month"
            date={currentDate}
            onNavigate={handleNavigate}
            tooltipAccessor={(event: Appointment) => event.title}
            onSelectEvent={(event: Appointment) => alert(`${event.title} at ${format(event.start, "p")}`)}
            eventPropGetter={eventStyleGetter}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm"
            components={{
              toolbar: CustomToolbar,
              month: {
                header: CustomHeader,
                dateHeader: CustomDateHeader,
              },
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

const CustomHeader = ({ date, label }: { date: Date; label: string }) => (
  <div className="text-center py-1 sm:py-2 font-semibold text-xs sm:text-sm uppercase text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
    {label}
  </div>
)

const CustomDateHeader = ({ date, label }: { date: Date; label: string }) => (
  <div
    className={`text-center p-1 text-xs sm:text-sm ${
      isSameMonth(date, new Date())
        ? "font-semibold text-gray-800 dark:text-gray-400"
        : "text-gray-400 dark:text-gray-600"
    }`}
  >
    {label}
  </div>
)

function isSameMonth(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

