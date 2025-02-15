import { createClient } from "@/utils/supabase/client"

export async function getUserProfile(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return {
      id: user.id,
      ...user.user_metadata,
    }
  }

  return null
}