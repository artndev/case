import { cn } from '@/lib/utils'
import React from 'react'
import { I_WidgetProps } from '../_types'

const Widget: React.FC<I_WidgetProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        `
          border rounded-sm bg-white overflow-hidden
          transition-[width,_height] duration-250 ease-in-out
        `,
        className
      )}
      {...props}
    >
      <div className="flex flex-col w-full min-h-full">{children}</div>
    </div>
  )
}

export default Widget
