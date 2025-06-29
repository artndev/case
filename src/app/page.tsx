import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { UserRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import { signOut } from './actions'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) redirect('/auth/sign-in')

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="flex flex-col items-center gap-3 w-[max-content]"
        action={signOut}
      >
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-sm mb-3">
          <UserRound className="size-4" />
        </div>
        <div className="font-semibold text-xl">Hello, {data.user.email}!</div>
        <Button type="submit" className="self-start w-1/2">
          Log out
        </Button>
      </form>
    </div>
  )
}
