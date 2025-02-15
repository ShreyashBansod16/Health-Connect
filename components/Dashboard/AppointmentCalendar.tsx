"use client";

import { useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { Calendar, dateFnsLocalizer} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctorName: string;
}

interface APIAppointment {
  id: string;
  date: string;
  time: string;
  doctor: {
    name: string;
  };
}

const fetchAppointments = async (userId: string, start: string, end: string): Promise<Appointment[]> => {
  const response = await fetch(`/api/doctor?userId=${userId}&start=${start}&end=${end}`);
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

  const data: APIAppointment[] = await response.json();
  return data.map((appointment) => ({
    id: appointment.id,
    title: `Appointment with Dr. ${appointment.doctor.name}`,
    start: new Date(`${appointment.date}T${appointment.time}`),
    end: new Date(`${appointment.date}T${appointment.time}`),
    doctorName: appointment.doctor.name,
  }));
};

export default function AppointmentCalendar({ user }: { user: User }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const memoizedDates = useMemo(() => {
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  }, [currentDate]); // ✅ Keeps useMemo dependencies clean

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["appointments", user.id, memoizedDates.start.toISOString(), memoizedDates.end.toISOString()],
    queryFn: () => fetchAppointments(user.id, memoizedDates.start.toISOString(), memoizedDates.end.toISOString()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleNavigate = (newDate: Date) => setCurrentDate(newDate);

  const CustomToolbar = () => (
    <div className="flex justify-between items-center mb-4 sm:mb-6 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-1 sm:space-x-2">
        <button onClick={() => handleNavigate(subMonths(currentDate, 1))} className="toolbar-button">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button onClick={() => handleNavigate(addMonths(currentDate, 1))} className="toolbar-button">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="text-center">
        <span className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200">
          {format(currentDate, "MMMM yyyy")}
        </span>
      </div>
      <button onClick={() => handleNavigate(new Date())} className="today-button">
        Today
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 px-2 sm:px-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto"
    >
      {isLoading ? (
        <div className="loading-container">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Loading appointments...</span>
        </div>
      ) : error ? (
        <div className="error-container">
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
            tooltipAccessor={(event) => event.title}
            onSelectEvent={(event) => alert(`${event.title} at ${format(event.start, "p")}`)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm"
            components={{ toolbar: CustomToolbar }}
          />
        </div>
      )}
    </motion.div>
  );
}
