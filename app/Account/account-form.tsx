"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Profile {
  id: string
  userId: string
  fullName: string | null
  username: string
  website: string | null
  avatarUrl: string | null
}

export default function AccountForm({ user }: { user: User | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      try {
        const response = await fetch(`/api/profile?userId=${user.id}`)
        const data = await response.json()

        if (response.ok) {
          if (data.isNewUser) {
            setIsNewUser(true)
            setIsDialogOpen(true)
          } else {
            setProfile(data)
          }
        } else {
          console.error("Error fetching profile:", data.error)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setLoading(true)

    const formData = new FormData(event.currentTarget)
    formData.append("userId", user.id)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsNewUser(false)
        setIsDialogOpen(false)
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const ProfileForm = () => (
    <form onSubmit={updateProfile} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="text" value={user?.email} disabled />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" type="text" defaultValue={profile?.fullName || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" defaultValue={profile?.username || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" type="url" defaultValue={profile?.website || ""} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {!isNewUser && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Profile</DialogTitle>
            </DialogHeader>
            <ProfileForm />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={isDialogOpen && isNewUser} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    </>
  )
}


