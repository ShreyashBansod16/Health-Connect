import { createClient } from "@/utils/supabase/server"
import DashboardHeader from "@/components/Dashboard/DashboardHeader"
import QuickActionCards from "@/components/Dashboard/QuickActionCard"
import MobileMenu from "@/components/Dashboard/MobileMenu"
import MobileTabsWrapper from "@/components/Dashboard/MobileNAvigation"
import { Toaster } from "react-hot-toast"
import { redirect } from "next/navigation"
import prisma from "@/utils/prisma"
import AccountForm from "./account-form"

export default async function PatientDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <AccountForm user={user} />
      </div>
    )
  }

  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="lg:hidden">
          <div className="flex justify-between items-center p-2">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <MobileMenu user={user} />
          </div>
        </div>
        <div className="hidden lg:block">
          <DashboardHeader user={user} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Quick Actions Section */}
          <QuickActionCards user={user} />

          {/* Mobile Tabs Wrapper */}
          <MobileTabsWrapper user={user} />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1E40AF",
            color: "#FFFFFF",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            maxWidth: "90vw",
            textAlign: "center",
          },
        }}
      />
    </div>
  )
}