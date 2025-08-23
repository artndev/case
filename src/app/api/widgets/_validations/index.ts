import { z } from 'zod'
import { WidgetSizes } from '../_types/config'

export const saveWidgets_body_widget = z.object({
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

export type T_saveWidgets_body_widget = z.infer<typeof saveWidgets_body_widget>

export const saveWidgets_body = z.object({
  user_id: z
    .string()
    .uuid("'user_id' must be in UUID format")
    .nonempty("'user_id' cannot be empty"),
  widgets: z
    .array(saveWidgets_body_widget)
    .nonempty("'widgets' cannot be empty"),
})

export type T_saveWidgets_body = z.infer<typeof saveWidgets_body>

export const deleteWidget_id = z
  .string()
  .uuid("'id' must be in UUID format")
  .nonempty("'id' cannot be empty")

export type T_deleteWidget_id = z.infer<typeof deleteWidget_id>
