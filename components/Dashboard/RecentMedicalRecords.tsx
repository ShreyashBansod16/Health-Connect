"use client"
import type { User } from "@supabase/supabase-js"
import { FileText, PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// ... (keep the existing interfaces and fetchMedicalRecords function)

export default function RecentMedicalRecords({ user }: { user: User }) {
  // ... (keep the existing state and query)

  return (
    <Card className="h-[calc(100vh-10rem)] shadow-xl rounded-xl bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 mr-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            Recent Medical Records
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-auto">{/* ... (keep the existing content) */}</CardContent>
    </Card>
  )
}

