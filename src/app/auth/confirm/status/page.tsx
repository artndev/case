import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GalleryVerticalEnd, Mail } from 'lucide-react'

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
              Open your email box to unfold it. Do not forget to check the spam
              folder out!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="flex justify-center items-center w-[100px] h-[100px]">
              <Mail size={'80%'} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
