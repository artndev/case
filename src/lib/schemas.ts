import { z } from 'zod'
import * as regexes from './regexes'

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

export const caseNameSchema = z.object({
  casename: z.string().nonempty(),
})

export const resetPasswordSchema = z.object({
  email: signInSchema.shape.email,
})

export const updatePasswordSchema = z.object({
  password: signInSchema.shape.password,
})
