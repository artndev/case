import { cn } from '@/lib/utils'
import React from 'react'
import { I_WidgetProps } from '../_types'

const Widget: React.FC<I_WidgetProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        `
        border rounded-sm bg-gray-50 relative
      `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Widget
