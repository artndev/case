'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { I_FormProps } from '../_types'
import { signInWithOAuth } from '../actions'

export function SignInForm({
  onSubmit,
  defaultValues,
}: I_FormProps<z.infer<typeof validations.SignInForm.POST.body>>) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(validations.SignInForm.POST.body),
    defaultValues: defaultValues ?? {
      email: '',
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
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form action={onAction} className="p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-xl font-semibold leading-none">
                        Welcome back!
                      </h1>
                      <p className="text-sm text-muted-foreground text-balance">
                        Enter the credentials below to open your case
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
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

                    <FormField
                      control={form.control}
                      name="password"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>
                            Password
                            <Link
                              href="/auth/reset-password"
                              className="ml-auto text-sm underline-offset-2 hover:underline"
                            >
                              Forgot your password?
                            </Link>
                          </FormLabel>
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
                              onClick={() =>
                                setIsPasswordHidden(!isPasswordHidden)
                              }
                            >
                              {!isPasswordHidden ? <Eye /> : <EyeClosed />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-3">
                      <Button type="submit" disabled={isSubmitting}>
                        Sign in
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        formAction={() => signInWithOAuth('google')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="text-center text-sm">
                      Don&apos;t have an account?{' '}
                      <Link
                        href={`/sign-up`}
                        className="font-semibold underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>

              <div className="bg-muted relative hidden md:block">
                <img
                  src="https://placehold.co/1000x500.png"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
