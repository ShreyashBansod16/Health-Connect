"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { format, addMinutes, isBefore, startOfToday, parseISO, set } from "date-fns"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialization: string
}

interface Appointment {
  userId: string
  date: string
  time: string
  doctorId: string
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await fetch("/api/appointmnet")
  if (!response.ok) throw new Error("Failed to fetch doctors")
  return response.json()
}

const bookAppointment = async (appointmentData: Appointment): Promise<Appointment> => {
  const response = await fetch("/api/doctor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  })
  if (!response.ok) throw new Error("Failed to book appointment")
  return response.json()
}

export default function AppointmentForm({
  user,
  onAppointmentBooked,
}: {
  user: User
  onAppointmentBooked: () => void
}) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const queryClient = useQueryClient()

  const { data: doctors, isLoading: isDoctorsLoading } = useQuery<Doctor[], Error>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  })

  const bookAppointmentMutation = useMutation<Appointment, Error, Appointment>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", user.id] })
      toast.success("Appointment booked successfully!")
      onAppointmentBooked()
    },
    onError: () => {
      toast.error("Failed to book appointment. Please try again.")
    },
  })

  const filteredDoctors =
    doctors?.filter((doctor: Doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  const handleDoctorSelect = (doctor: Doctor) => {
    setDoctorId(doctor.id)
    setSearchQuery(doctor.name)
    setShowSuggestions(false) // Hide suggestions after selection
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true) // Show suggestions when typing
    if (e.target.value === "") {
      setDoctorId("") // Clear selected doctor if search is empty
    }
  }

  function generateTimeSlots() {
    const slots = []
    const now = new Date()
    const currentDate = parseISO(date)
    const isToday = format(now, "yyyy-MM-dd") === date
    let startTime = set(currentDate, { hours: 9, minutes: 0, seconds: 0 }) // Start at 9 AM
    const endTime = set(currentDate, { hours: 17, minutes: 0, seconds: 0 }) // End at 5 PM

    if (isToday) {
      startTime = now // If it's today, start from the current time
    }

    let currentSlot = startTime
    while (isBefore(currentSlot, endTime)) {
      slots.push(format(currentSlot, "HH:mm"))
      currentSlot = addMinutes(currentSlot, 30) // 30-minute slots
    }

    return slots
  }

  function handleBookAppointment() {
    if (!date || !time || !doctorId) {
      toast.error("Please select a date, time, and doctor.")
      return
    }

    const selectedDateTime = parseISO(`${date}T${time}`)
    if (isBefore(selectedDateTime, new Date())) {
      toast.error("Please select a future date and time.")
      return
    }

    bookAppointmentMutation.mutate({
      userId: user.id,
      date,
      time,
      doctorId,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(startOfToday(), "yyyy-MM-dd")}
              className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {generateTimeSlots().map((slot) => (
                  <SelectItem key={slot} value={slot} className="text-gray-800 dark:text-gray-200">
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="doctor" className="text-gray-700 dark:text-gray-300">
              Doctor
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search for a doctor"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full"
            />
            {showSuggestions && searchQuery && filteredDoctors.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white dark:bg-gray-800 shadow-lg"
              >
                {filteredDoctors.map((doctor: Doctor) => (
                  <li
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {doctor.name} - {doctor.specialization}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          <Button
            onClick={handleBookAppointment}
            disabled={bookAppointmentMutation.isPending}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {bookAppointmentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

