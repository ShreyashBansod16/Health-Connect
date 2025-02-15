"use client";

import { useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { format, addMinutes, isBefore, startOfToday, parseISO, set } from "date-fns";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Appointment {
  userId: string;
  date: string;
  time: string;
  doctorId: string;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await fetch("/api/appointmnet");
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
};

const bookAppointment = async (appointmentData: Appointment): Promise<Appointment> => {
  const response = await fetch("/api/doctor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) throw new Error("Failed to book appointment");
  return response.json();
};

export default function AppointmentForm({ user, onAppointmentBooked }: { user: User; onAppointmentBooked: () => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const { data: doctors = [] } = useQuery<Doctor[], Error>({ queryKey: ["doctors"], queryFn: fetchDoctors });

  const bookAppointmentMutation = useMutation<Appointment, Error, Appointment>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", user.id] });
      toast.success("Appointment booked successfully!");
      onAppointmentBooked();
    },
    onError: () => {
      toast.error("Failed to book appointment. Please try again.");
    },
  });

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    const now = new Date();
    const currentDate = parseISO(date);
    const isToday = format(now, "yyyy-MM-dd") === date;
    let startTime = set(currentDate, { hours: 9, minutes: 0, seconds: 0 });
    const endTime = set(currentDate, { hours: 17, minutes: 0, seconds: 0 });

    if (isToday) {
      startTime = now;
    }

    let currentSlot = startTime;
    while (isBefore(currentSlot, endTime)) {
      slots.push(format(currentSlot, "HH:mm"));
      currentSlot = addMinutes(currentSlot, 30);
    }

    return slots;
  }, [date]);

  const handleBookAppointment = () => {
    if (!date || !time || !doctorId) {
      toast.error("Please select a date, time, and doctor.");
      return;
    }

    const selectedDateTime = parseISO(`${date}T${time}`);
    if (isBefore(selectedDateTime, new Date())) {
      toast.error("Please select a future date and time.");
      return;
    }

    bookAppointmentMutation.mutate({
      userId: user.id,
      date,
      time,
      doctorId,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
      <Card className="shadow-lg bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={format(startOfToday(), "yyyy-MM-dd")} />

          <Label>Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeSlots().map((slot) => (
                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Doctor</Label>
          <Select value={doctorId} onValueChange={setDoctorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase())).map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleBookAppointment} disabled={bookAppointmentMutation.isPending}>
            {bookAppointmentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Book Appointment"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
