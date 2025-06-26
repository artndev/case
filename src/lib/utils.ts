import regexes from '@/regexes'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const loginSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
})

export const signupSchema = z.object({})

declare global {
  export type TLoginSchema = z.infer<typeof loginSchema>
}
