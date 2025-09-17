import { cn } from '@/lib/utils'
import React from 'react'
import { I_WidgetProps } from '../_types'

const Widget: React.FC<I_WidgetProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('border rounded-sm bg-white', className)} {...props}>
      <div className="w-full min-h-full break-words">{children}</div>
    </div>
  )
}

export default Widget
