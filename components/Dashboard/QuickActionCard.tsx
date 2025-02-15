"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ClipboardList, Activity, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth, format, parseISO, compareAsc, isBefore, isAfter } from "date-fns";
import type { User } from "@supabase/supabase-js";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: { name: string };
  start: Date; // Processed field
}

const fetchAppointments = async (userId: string, start: string, end: string): Promise<Appointment[]> => {
  const response = await fetch(`/api/doctor?userId=${userId}&start=${start}&end=${end}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.map((appointment: { date: string; time: string; doctor: { name: string } }) => ({
    ...appointment,
    start: parseISO(`${appointment.date}T${appointment.time}`),
  })).sort((a: { start: any; }, b: { start: any; }) => compareAsc(a.start, b.start));
};

interface QuickActionCardsProps {
  user: User;
}

export default function QuickActionCards({ user }: QuickActionCardsProps) {
  const today = useMemo(() => new Date(), []);

  const { start, end } = useMemo(() => ({
    start: startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1)),
    end: endOfMonth(new Date(today.getFullYear(), today.getMonth() + 1)),
  }), [today]);

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ["appointments", user.id, start.toISOString(), end.toISOString()],
    queryFn: () => fetchAppointments(user.id, start.toISOString(), end.toISOString()),
  });

  const upcomingAppointments = appointments.filter(apt => isAfter(apt.start, today));
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  const pastAppointments = appointments.filter(apt => isBefore(apt.start, today));
  const lastAppointment = pastAppointments.length > 0 ? pastAppointments[pastAppointments.length - 1] : null;

  const healthStatus = "Good"; // Replace with API call
  const medicalRecordsCount = 8; // Replace with API call

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading appointments</div>;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <QuickActionCard
        title="Upcoming Appointments"
        value={upcomingAppointments.length.toString()}
        icon={<CalendarDays className="h-8 w-8 text-blue-600" />}
        description={
          nextAppointment
            ? `Next: ${format(nextAppointment.start, "MMM d, yyyy")} with Dr. ${nextAppointment.doctor.name}`
            : "No upcoming appointments"
        }
        link="#"
      />
      <QuickActionCard
        title="Recent Consultations"
        value={lastAppointment ? format(lastAppointment.start, "MMM d, yyyy") : "None"}
        icon={<ClipboardList className="h-8 w-8 text-green-600" />}
        description={
          lastAppointment
            ? `Last: ${format(lastAppointment.start, "MMM d, yyyy")} with Dr. ${lastAppointment.doctor.name}`
            : "No recent consultations"
        }
        link="#"
      />
      <QuickActionCard
        title="Health Status"
        value={healthStatus}
        icon={<Activity className="h-8 w-8 text-yellow-600" />}
        description="Based on recent checkups"
        link="#"
      />
      <QuickActionCard
        title="Medical Records"
        value={medicalRecordsCount.toString()}
        icon={<FileText className="h-8 w-8 text-purple-600" />}
        description="View your medical history"
        link="#"
      />
    </motion.section>
  );
}

interface QuickActionCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  link: string;
}

function QuickActionCard({ title, value, icon, description, link }: QuickActionCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={link} passHref>
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800">
          <CardContent className="flex flex-col h-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 mr-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{title}</h3>
            </div>
            <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{value}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
