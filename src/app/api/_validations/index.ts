import { BREAKPOINTS, WIDGET_SIZES } from '@/lib/config'
import { z } from 'zod'

export default {
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
