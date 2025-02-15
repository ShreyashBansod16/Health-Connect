"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Bell, LogOut, MenuIcon, XIcon, MoonIcon, SunIcon, UserCircle, Calendar, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountForm } from "./AccountForm";
import AppointmentList from "@/components/Dashboard/AppointmentList";

interface Profile {
  id: string;
  userId: string;
  fullName: string | null;
  username: string;
  avatarUrl: string | null;
}

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const response = await fetch(`/api/profile?userId=${userId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

const handleLogout = async () => {
  try {
    const response = await fetch("/auth/signout", {
      method: "POST",
    });
    if (response.ok) {
      window.location.href = "/login";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default function DashboardHeader({ user }: { user: User }) {
  const { data: profile, isLoading } = useQuery<Profile | null, Error>({
    queryKey: ["profile", user.id],
    queryFn: () => fetchProfile(user.id),
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isAppointmentListOpen, setIsAppointmentListOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { href: "/Account", label: "Dashboard", icon: Home },
    { href: "#", label: "Appointments", icon: Calendar, onClick: () => setIsAppointmentListOpen(true) },
    { href: "/records", label: "Medical Records", icon: FileText },
    { href: "/article", label: "Articles", icon: FileText },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              HealthConnect
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.onClick}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.fullName || ""} />
                    <AvatarFallback>{profile?.fullName ? profile.fullName.charAt(0) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAccountFormOpen(true)}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="md:hidden" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.onClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
      <Dialog open={isAccountFormOpen} onOpenChange={setIsAccountFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{profile ? "Your Profile" : "Complete Your Profile"}</DialogTitle>
          </DialogHeader>
          <AccountForm user={user} onClose={() => setIsAccountFormOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isAppointmentListOpen} onOpenChange={setIsAppointmentListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointments</DialogTitle>
          </DialogHeader>
          <AppointmentList user={user} />
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}