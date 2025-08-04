'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resetPasswordSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { I_FormProps } from '../_types'

export function ResetPasswordForm({
  onSubmit,
  className,
  ...props
}: I_FormProps) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onAction = async (formData: FormData) => {
    setIsSubmitting(true)

    const isValid = await form.trigger()
    if (!isValid) {
      setIsSubmitting(false)
      return
    }

    await onSubmit(formData)

    form.reset()
    setIsSubmitting(false)
  }

  return (
    <Card
      className={cn('w-full max-w-sm pt-0 overflow-hidden', className)}
      {...props}
    >
      <div className="relative w-full h-[250px]">
        <Image src="/cats.gif" alt="cats" fill={true} objectFit="cover" />
      </div>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-xl leading-none">
          Reset your password
        </CardTitle>
        <CardDescription>
          To which email should we send the reset link to?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6" action={onAction}>
            <FormField
              control={form.control}
              name="email"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="mail@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
