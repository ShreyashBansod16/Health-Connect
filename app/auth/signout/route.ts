import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await (await supabase).auth.getUser()

  if (user) {
    await (await supabase).auth.signOut()

    // Clear any session cookies
    ;(await
      // Clear any session cookies
      cookies()).delete("supabase-auth-token")
  }

  // Revalidate the layout to update the UI
  revalidatePath("/", "layout")

  // Redirect to the login page
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  })
}

