'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: user, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Incorrect email or password. ' }
    }
    
    return { error: 'An unexpected error occurred. Please try again later.' }
  }

  revalidatePath('/', 'layout')
  redirect('/Account')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error)
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid password. Please choose a stronger password.' }
    }
    return { error: 'An unexpected error occurred. Please try again later.' }
  }

  revalidatePath('/', 'layout')
  redirect('/Account')
}
