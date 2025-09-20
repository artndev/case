export interface I_ArrowButtonProps extends React.ComponentProps<'button'> {
  direction: 'left' | 'right'
  variant?: 'ghost' | 'outline'
  isExpanded?: boolean
  className?: string
}

export interface I_LinkPreviewProps extends React.ComponentProps<'div'> {
  caption?: string | null
  url: string
  subClassName?: string
}

export {}
