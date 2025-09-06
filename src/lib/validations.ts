import { z } from 'zod'
import { WIDGET_SIZES } from './config'
import * as regexes from './regexes'

/**
 * Validation schemas for everything
 */
export default {
  SignInForm: {
    POST: {
      body: z.object({
        email: z.string().nonempty().email(),
        password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
      }),
    },
  },
  SignUpForm: {
    POST: {
      body: z
        .object({
          email: z.string().nonempty().email(),
          password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
          confirmPassword: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
        })
        .refine(
          ({ password, confirmPassword }) => password === confirmPassword,
          {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
          }
        ),
    },
  },
  ResetPasswordForm: {
    POST: {
      body: z.object({
        email: z.string().nonempty().email(),
      }),
    },
  },
  UpdatePasswordForm: {
    POST: {
      body: z.object({
        password: z.string().nonempty().regex(regexes.PASSWORD_REGEX),
      }),
    },
  },
  CaseNameForm: {
    POST: {
      body: z.object({
        casename: z.string().nonempty(),
      }),
    },
  },
  Widgets_API: {
    POST: {
      body: z.object({
        user_id: z
          .string()
          .uuid("'user_id' must be in UUID format")
          .nonempty("'user_id' cannot be empty"),
        widgets: z
          .array(
            z.object({
              id: z.string().uuid("'id' must be in UUID format").optional(),
              widget_type_id: z
                .string()
                .uuid("'widget_type_id' must be in UUID format")
                .optional(),
              x_sm: z.number().nonnegative("'x_sm' cannot be below zero"),
              y_sm: z
                .number()
                .nonnegative("'y_sm' cannot be below zero")
                .nullable(), // NULL for Infinity
              x_md: z.number().nonnegative("'x_md' cannot be below zero"),
              y_md: z
                .number()
                .nonnegative("'y_md' cannot be below zero")
                .nullable(), // NULL for Infinity
              size: z.enum(WIDGET_SIZES, {
                message: `Cannot found 'size' in suggested values: ${WIDGET_SIZES.join(', ')}`,
              }),
            })
          )
          .nonempty("'widgets' cannot be empty"),
      }),
      // params: {
      //   breakpoint: z.enum(BREAKPOINTS, {
      //     message: `Cannot found 'breakpoint' in suggested values: ${BREAKPOINTS.join(', ')}`,
      //   }),
      // },
    },
    DELETE: {
      params: {
        id: z
          .string()
          .uuid("'id' must be in UUID format")
          .nonempty("'id' cannot be empty"),
      },
    },
  },
}
