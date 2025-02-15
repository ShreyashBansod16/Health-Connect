"use client"

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface User {
  id: string;
}

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctorId: string;
}

export default function AppointmentCalendar({ user }: { user: User }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/doctor?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const formattedAppointments = await Promise.all(
        data.map(async (appointment: any) => {
          let doctorName = "Unknown";
          if (appointment.doctorId) {
            try {
              const doctorResponse = await fetch(`/api/appointmnet`);
              if (doctorResponse.ok) {
                const doctorData = await doctorResponse.json();
                doctorName = doctorData[0]?.name || "Unknown";
              }
            } catch (error) {
              console.error("Error fetching doctor details:", error);
            }
          }

          return {
            id: appointment.id,
            title: `Appointment with Dr. ${doctorName}`,
            start: new Date(`${appointment.date}T${appointment.time}`),
            end: new Date(`${appointment.date}T${appointment.time}`),
            doctorId: appointment.doctorId,
          };
        })
      );

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error instanceof Error ? error.message : "An error occurred while fetching appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={fetchAppointments}
      >
        Refresh
      </button>
      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={["month"]}
          defaultView="month"
          tooltipAccessor={(event: Appointment) => event.title}
          onSelectEvent={(event: Appointment) => alert(event.title)}
        />
      )}
    </div>
  );
}
