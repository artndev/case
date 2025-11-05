import { cn } from '@/lib/utils'
import React from 'react'
import { I_WidgetProps } from './_types'

// Attach className only to the top-level div only
const Widget: React.FC<I_WidgetProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('border rounded-sm bg-white', className)} {...props}>
      {children}
    </div>
  )
}

export default Widget
