"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
    avatarUrl?: string | null;
  };
}

interface AppointmentListProps {
  user: {
    id: string;
  };
}

export default function AppointmentList({ user }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/doctor ?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="flex items-center space-x-4 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.doctor.avatarUrl || ""} alt={appointment.doctor.name} />
                <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardContent className="flex-grow">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-semibold">{appointment.doctor.name}</CardTitle>
                  <p className="text-sm text-gray-500">{appointment.doctor.specialization}</p>
                </CardHeader>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No appointments found.</p>
        )}
      </div>
    </ScrollArea>
  );
}