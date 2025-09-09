import { I_WidgetProps } from '@/app/board/_types'
import React from 'react'
import Widget from '../widget'

const Widget1: React.FC<I_WidgetProps> = ({ widget, children, ...props }) => {
  return (
    <Widget widget={widget} {...props}>
      <div className="drag-handle cursor-move font-bold mb-1">
        {widget.widget_type_details.alias}
      </div>

      {children}
    </Widget>
  )
}

export default Widget1
