"use client"

import { useState, useEffect } from "react"
import { format, addMinutes, isBefore, startOfToday, parseISO, set } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
}

interface Appointment {
  date: string
  time: string
  doctorId: string
}

const AppointmentForm = ({
  user,
  addAppointment,
}: {
  user: User
  addAppointment: (appointment: Appointment) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchActive, setIsSearchActive] = useState(false)

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("/api/appointmnet")
        if (!response.ok) throw new Error("Failed to fetch doctors")

        const data = await response.json()
        setDoctors(data)
        setFilteredDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      }
    }

    fetchDoctors()
  }, [])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value
    setSearchQuery(query)

    if (query) {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredDoctors(filtered)
      setIsSearchActive(true)
    } else {
      setFilteredDoctors(doctors)
      setIsSearchActive(false)
    }
  }

  function selectDoctor(doctor: Doctor) {
    setDoctorId(doctor.id)
    setSearchQuery(doctor.name)
    setIsSearchActive(false)
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

  async function bookAppointment() {
    if (!date || !time || !doctorId) {
      alert("Please select a date, time, and doctor.")
      return
    }

    const selectedDateTime = parseISO(`${date}T${time}`)
    if (isBefore(selectedDateTime, new Date())) {
      alert("Please select a future date and time.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, date, time, doctorId }),
      })

      if (!response.ok) throw new Error("Failed to book appointment")

      addAppointment({ date, time, doctorId })
      alert("Appointment booked successfully!")
      setDate("")
      setTime("")
      setSearchQuery("")
      setDoctorId("")
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Error booking appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={format(startOfToday(), "yyyy-MM-dd")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeSlots().map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor">Doctor</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search for a doctor"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearchActive && filteredDoctors.length > 0 && (
            <ul className="mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
              {filteredDoctors.map((doctor) => (
                <li
                  key={doctor.id}
                  onClick={() => selectDoctor(doctor)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {doctor.name} - {doctor.specialization}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button onClick={bookAppointment} disabled={loading} className="w-full">
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function App({ user }: { user: User }) {
  const [_appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(`/api/doctor?userId=${user.id}`)
        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [user.id])

  const addAppointment = (newAppointment: Appointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment])
  }

  return (
    <div className="container mx-auto px-4">
      <AppointmentForm user={user} addAppointment={addAppointment} />
    </div>
  )
}

  