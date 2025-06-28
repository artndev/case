import { GalleryVerticalEnd, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Status() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-sm">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Art Inc.
        </a>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Confirmation email has been sent
            </CardTitle>
            <CardDescription>
              Open your email box and check it out
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-[100px] h-[100px]">
              <Mail size={'100%'} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
