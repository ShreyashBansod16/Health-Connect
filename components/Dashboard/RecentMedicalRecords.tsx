"use client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FileText, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  description: string;
}

const fetchMedicalRecords = async (userId: string): Promise<MedicalRecord[]> => {
  console.log("Fetching medical records for user:", userId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "1", title: "Blood Test", date: "2025-02-10", description: "Routine blood test results." },
        { id: "2", title: "X-Ray", date: "2025-01-15", description: "Chest X-Ray for cough diagnosis." },
      ]);
    }, 1000);
  });
};

export default function RecentMedicalRecords({ user }: { user: User }) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      fetchMedicalRecords(user.id).then((data) => {
        setRecords(data);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <Card className="h-auto sm:h-[calc(100vh-10rem)] shadow-xl rounded-xl bg-white dark:bg-gray-800 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 mr-2 sm:mr-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm sm:text-base">Recent Medical Records for {user.email}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 mt-2 sm:mt-0"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-auto sm:h-[calc(100%-5rem)] overflow-auto">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">Loading records...</p>
        ) : records.length > 0 ? (
          <ul className="space-y-4">
            {records.map((record) => (
              <li key={record.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{record.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{record.date}</p>
                <p className="text-gray-700 dark:text-gray-300">{record.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No medical records found.</p>
        )}
      </CardContent>
    </Card>
  );
}
