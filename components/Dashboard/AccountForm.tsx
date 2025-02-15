"use client"


import type { User } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import type React from "react"

interface Profile {
  id: string
  userId: string
  fullName: string | null
  username: string
  website: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const response = await fetch(`/api/profile?userId=${userId}`)
  if (!response.ok) {
    if (response.status === 404) {
      // Profile not found, return null for new users
      return null
    }
    throw new Error("Failed to fetch profile")
  }
  return response.json()
}

const createOrUpdateProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update profile")
  }
  return response.json()
}

export function AccountForm({ user, onClose }: { user: User; onClose: () => void }) {
  
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<Profile | null, Error>({
    queryKey: ["profile", user.id],
    queryFn: () => fetchProfile(user.id),
  })

  const mutation = useMutation<Profile, Error, Partial<Profile>>({
    mutationFn: createOrUpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
      toast.success("Profile updated successfully")
      onClose()
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const profileData: Partial<Profile> = {
      userId: user.id,
      fullName: formData.get("fullName") as string,
      username: formData.get("username") as string,
      website: formData.get("website") as string,
    }
    mutation.mutate(profileData)
  }

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading profile. Please try again later.</div>
  }

  return (
    <div className="dark:bg-gray-800 p-4 rounded-lg">
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                value={user?.email}
                disabled
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile?.fullName || ""}
                placeholder="Enter your full name"
                required
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                defaultValue={profile?.username || ""}
                placeholder="Choose a username"
                required
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={profile?.website || ""}
                placeholder="https://yourwebsite.com"
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {mutation.isPending ? "Updating..." : profile ? "Update Profile" : "Complete Profile"}
              </Button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

