import type { I_ButtonArrowProps } from '@/components/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

const ArrowButton: React.FC<I_ButtonArrowProps> = ({
  direction,
  variant,
  isExpanded,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      variant={variant ?? 'ghost'}
      className={cn(
        'hover:text-foreground hover:bg-transparent active:text-foreground focus:text-foreground',
        direction === 'left'
          ? 'hover:[&_.icon]:-translate-x-0.5 active:[&_.icon]:-translate-x-0.5'
          : 'hover:[&_.icon]:translate-x-0.5 active:[&_.icon]:translate-x-0.5',
        !isExpanded &&
          'w-[max-content] h-[max-content] text-muted-foreground p-0!',
        className
      )}
      {...props}
    >
      {direction === 'left' && (
        <ArrowLeft className="icon transition-transform duration-250" />
      )}
      {children}
      {direction === 'right' && (
        <ArrowRight className="icon transition-transform duration-250" />
      )}
    </Button>
  )
}

export default ArrowButton
