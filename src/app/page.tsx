import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { signOut } from './(auth)/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="flex flex-col gap-3 w-[max-content]" action={signOut}>
        <div className="font-semibold text-xl">Hello, {data.user.email}!</div>
        <Button type="submit" className="w-1/2">
          Log out
        </Button>
      </form>
    </div>
  )
}
