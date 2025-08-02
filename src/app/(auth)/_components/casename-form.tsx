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
import { caseNameSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { I_FormProps } from '../_types'
import { validateCaseName } from '../actions'

export function CaseNameForm({ onSubmit }: I_FormProps) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(caseNameSchema),
    defaultValues: {
      casename: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onAction = async (formData: FormData) => {
    setIsSubmitting(true)

    const isNotUnique = await validateCaseName(
      formData.get('casename') as string
    )
    if (isNotUnique) {
      form.setError('casename', {
        message: 'This casename has already been taken',
      })
      setIsSubmitting(false)
      return
    }

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
    <Card className="w-full max-w-sm pt-0 overflow-hidden">
      <div className="relative w-full h-[250px]">
        <Image src="/cats.gif" alt="cats" fill={true} objectFit="cover" />
      </div>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-xl leading-none">
          Take your casename
        </CardTitle>
        <CardDescription>
          Enter your casename in the field below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6" action={onAction}>
            <FormField
              control={form.control}
              name="casename"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Casename</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              Take
            </Button>
            <div className="text-center text-sm">
              Have an account?{' '}
              <Link
                href={`/sign-in`}
                className="font-semibold underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
