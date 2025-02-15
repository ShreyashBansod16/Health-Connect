
import { redirect } from "next/navigation";
import DoctorsPage from "@/components/Dashboard/Add_Doctor"; // Adjust the import if the file structure differs
import { createClient } from "@/utils/supabase/server";

const ALLOWED_USER_ID = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

export default async function AddDoctorPage() {
  
 const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
 if (!user || user.id !== ALLOWED_USER_ID) {
    redirect("/login");
  }

 

  return <DoctorsPage />;
}
