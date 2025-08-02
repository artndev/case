import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'

export default function Status() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="w-full max-w-sm pt-0 overflow-hidden">
        <div className="relative w-full h-[250px]">
          <Image src="/cats.gif" alt="cats" fill={true} objectFit="cover" />
        </div>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-xl leading-none">
            Instructions have been sent
          </CardTitle>
          <CardDescription>
            Check your email inbox for the next steps. If they&apos;re not
            there, please take a look at the spam folder!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
