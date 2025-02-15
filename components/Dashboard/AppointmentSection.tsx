"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, PlusCircle, ChevronDown, ChevronUp, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppointmentCalendar from "./AppointmentCalendar"
import AppointmentForm from "./AppointmentForm"

const queryClient = new QueryClient()

export default function AppointmentSection({ user }: { user: User }) {
  const [showCalendar, setShowCalendar] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMobileCalendar, setShowMobileCalendar] = useState(false)
  const [showMobileForm, setShowMobileForm] = useState(false)

  const toggleCalendar = () => {
    if (window.innerWidth < 1024) {
      setShowMobileCalendar(true)
      setShowMobileForm(false)
    } else {
      setShowCalendar(!showCalendar)
      setShowForm(false)
    }
  }

  const toggleForm = () => {
    if (window.innerWidth < 1024) {
      setShowMobileForm(true)
      setShowMobileCalendar(false)
    } else {
      setShowForm(!showForm)
      setShowCalendar(false)
    }
  }

  const handleAppointmentBooked = () => {
    setShowForm(false)
    setShowMobileForm(false)
    setShowCalendar(true)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="h-[calc(100vh-10rem)] max-h-[45rem] overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-gray-800 dark:text-gray-200">
              <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                <CalendarDays className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                Appointments
              </div>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-3 lg:hidden w-full">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleCalendar}
                  className="w-full flex items-center justify-center gap-2 py-6 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                >
                  <CalendarDays className="h-5 w-5" />
                  View Calendar
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={toggleForm}
                  className="w-full flex items-center justify-center gap-2 py-6 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <PlusCircle className="h-5 w-5" />
                  Book Appointment
                </Button>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden lg:flex space-x-2 ">
                <Button variant="outline" size="sm" onClick={toggleCalendar}>
                  {showCalendar ? (
                    <>
                      Hide Calendar <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Calendar <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button variant={showForm ? "destructive" : "default"} size="sm" onClick={toggleForm}>
                  {showForm ? (
                    <>
                      Cancel <X className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment <PlusCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Desktop Content */}
          <CardContent className="p-0 h-[calc(100%-4rem)] overflow-auto">
            <AnimatePresence mode="wait">
              {showCalendar && !showMobileCalendar && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 hidden lg:block"
                >
                  <AppointmentCalendar user={user} />
                </motion.div>
              )}
              {showForm && !showMobileForm && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 hidden lg:block"
                >
                  <AppointmentForm user={user} onAppointmentBooked={handleAppointmentBooked} />
                </motion.div>
              )}
            </AnimatePresence>
            {!showCalendar && !showForm && (
              <motion.div
                key="hidden-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 hidden lg:flex items-center justify-center h-full bg-white dark:bg-gray-800"
              >
               <p className="text-xl text-gray-600 dark:text-gray-300">
  Click &quot;Show Calendar&quot; or &quot;Book Appointment&quot; to view content
</p>

              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Calendar Modal */}
        <AnimatePresence>
          {showMobileCalendar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black lg:hidden"
                onClick={() => setShowMobileCalendar(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl p-6 lg:hidden"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Calendar</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileCalendar(false)}
                    className="rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <AppointmentCalendar user={user} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Appointment Form Modal */}
        <AnimatePresence>
          {showMobileForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black lg:hidden"
                onClick={() => setShowMobileForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl p-6 lg:hidden"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Book Appointment</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileForm(false)} className="rounded-full">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <AppointmentForm
                  user={user}
                  onAppointmentBooked={() => {
                    handleAppointmentBooked()
                    setShowMobileForm(false)
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </QueryClientProvider>
  )
}

