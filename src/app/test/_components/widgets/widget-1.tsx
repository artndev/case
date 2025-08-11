import React from 'react'
import Widget from '../widget'
import { I_WidgetProps } from '@/app/test/_types'

const Widget1: React.FC<I_WidgetProps> = ({ children, ...props }) => {
  return (
    <Widget {...props}>
      <div>Widget1</div>
      {children}
    </Widget>
  )
}

export default Widget1
