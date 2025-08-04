export interface I_ButtonArrowProps extends React.ComponentProps<'button'> {
  direction: 'left' | 'right'
  variant?: 'ghost' | 'outline'
  isExpanded?: boolean
  className?: string
}

export {}
