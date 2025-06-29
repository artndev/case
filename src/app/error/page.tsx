'use client'

import { X } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-6 w-[max-content]">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-sm">
          <X className="size-4" />
        </div>
        <div className="font-semibold text-xl">Sorry, something went wrong</div>
      </div>
    </div>
  )
}
