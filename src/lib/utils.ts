import regexes from '@/regexes'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const signInSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
})

export const signUpSchema = z
  .object({
    email: signInSchema.shape.email,
    password: signInSchema.shape.password,
    confirmPassword: signInSchema.shape.password,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  email: signInSchema.shape.email,
})

export const updatePasswordSchema = z.object({
  password: signInSchema.shape.password,
})
