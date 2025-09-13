import { cn } from '@/lib/utils'
import React from 'react'
import { I_WidgetProps } from '../_types'

const Widget: React.FC<I_WidgetProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('border rounded-md bg-white', className)} {...props}>
      {children}
    </div>
  )
}

export default Widget
