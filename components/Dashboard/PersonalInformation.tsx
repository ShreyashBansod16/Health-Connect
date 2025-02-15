"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AccountForm } from "./AccountForm"

export default function PersonalInformation({ user }: { user: User }) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <UserIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-200">Personal Information</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            View and edit your profile information here.
          </DialogDescription>
        </DialogHeader>
        <AccountForm user={user} onClose={() => setIsFormOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

