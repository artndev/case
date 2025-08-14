import React from 'react'
import Widget from '../widget'
import { I_WidgetProps } from '@/app/board/_types'

const Widget2: React.FC<I_WidgetProps> = ({ children, ...props }) => {
  return (
    <Widget {...props}>
      <div>Widget2</div>
      {children}
    </Widget>
  )
}

export default Widget2
