import { I_WidgetProps } from '@/app/board/_types'
import React from 'react'
import Widget from '../widget'

const Widget2: React.FC<I_WidgetProps> = ({ widget, children, ...props }) => {
  return (
    <Widget widget={widget} {...props}>
      <div className="w-full min-h-full break-words">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex justify-between items-center">
              <div className="drag-handle cursor-move font-bold">⠿</div>
              <div className="no-drag">{children}</div>
            </div>

            <hr />
          </div>

          <div className="no-drag p-2 pt-0">
            {widget.widget_type_details.alias}
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default Widget2
