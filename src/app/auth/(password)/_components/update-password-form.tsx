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
import { updatePasswordSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { I_FormProps } from '../_types'

export function UpdatePasswordForm({ onSubmit }: I_FormProps) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onAction = async (formData: FormData) => {
    const isValid = await form.trigger()

    if (!isValid) return

    setIsSubmitting(true)
    await onSubmit(formData)

    form.reset()
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Make changes</CardTitle>
        <CardDescription>
          Enter your new password below to update your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={onAction}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
