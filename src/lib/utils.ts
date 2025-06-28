import regexes from '@/regexes'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
})

export const resetPasswordSchema = z.object({
  email: authSchema.shape.email,
})

export const updatePasswordSchema = z.object({
  password: authSchema.shape.password,
})
