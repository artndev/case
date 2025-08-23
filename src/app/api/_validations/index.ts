import { z } from 'zod'
import { WidgetSizes } from './config'

export default {
  Widgets_API: {
    POST: z.object({
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
            x: z.number().nonnegative("'x' cannot be below zero"),
            y: z.number().nonnegative("'y' cannot be below zero"),
            size: z.enum(WidgetSizes, {
              message: `Cannot found 'size' in suggested values: ${WidgetSizes.join(', ')}`,
            }),
          })
        )
        .nonempty("'widgets' cannot be empty"),
    }),
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
