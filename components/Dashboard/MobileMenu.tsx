"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Calendar, FileText, Home, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AccountForm } from "./AccountForm"; 
import AppointmentList from "./AppointmentList";
import type { User as SupabaseUser } from "@supabase/supabase-js"; // Import Supabase User type

type MobileMenuProps = {
  user: SupabaseUser | null; // Define the user type properly
};

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAppointmentListModal, setShowAppointmentListModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowProfileModal(true);
    setIsOpen(false);
  };

  const handleAppointmentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAppointmentListModal(true);
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-5">
          <Link href="/Account" className="text-2xl font-bold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Home className="w-6 h-6" />
            Dashboard
          </Link>
          <button onClick={handleAppointmentsClick} className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Appointments
          </button>
          <Link href="/medical-records" className="text-2xl font-bold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FileText className="w-6 h-6" />
            Medical Records
          </Link>
          <Link href="/article" className="text-2xl font-bold flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FileText className="w-6 h-6" />
            Articles
          </Link>
          <button onClick={handleProfileClick} className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Profile
          </button>
          <button onClick={toggleDarkMode} className="text-2xl font-bold flex items-center gap-2">
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X />
          </Button>
        </div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowProfileModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl p-6"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Profile Settings</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowProfileModal(false)} className="rounded-full">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              {user && <AccountForm user={user} onClose={() => setShowProfileModal(false)} />}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Appointment List Modal */}
      <AnimatePresence>
        {showAppointmentListModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowAppointmentListModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl p-6"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Appointments</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowAppointmentListModal(false)} className="rounded-full">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              {user && <AppointmentList user={user} />}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
