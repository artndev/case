import React from 'react'
import { I_WidgetProps } from '../_types'

const Widget: React.FC<I_WidgetProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

export default Widget
