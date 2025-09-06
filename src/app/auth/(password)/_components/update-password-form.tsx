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
import { cn } from '@/lib/utils'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { I_FormProps } from '../_types'

export function UpdatePasswordForm({
  onSubmit,
  className,
  ...props
}: I_FormProps) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(validations.UpdatePasswordForm.POST.body),
    defaultValues: {
      password: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

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
          Update your password
        </CardTitle>
        <CardDescription>
          Enter your new password in the field below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6" action={onAction}>
            <FormField
              control={form.control}
              name="password"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={!isPasswordHidden ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      className="absolute top-[50%] right-0 -translate-y-[50%] -translate-x-[1px] h-[calc(100%-2px)] border-0!"
                      variant={'outline'}
                      size={'icon'}
                      onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                    >
                      {!isPasswordHidden ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
