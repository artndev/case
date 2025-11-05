'use client'

// ============= RGL STYLES =============
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// ======================================

import { Button } from '@/components/ui/button'
import { BREAKPOINT_MAP, COL_MAP, WIDGET_SIZE_MAP } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone } from 'lucide-react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { I_BoardPropsTest } from '../_types'

const RGL = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardPropsTest> = ({
  widgetTypesController,
  previewController,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-6 max-w-[900px] w-full', className)}>
      {/* Controls */}

      <div className="flex flex-col gap-6 self-start">
        {/* Widget types controller */}
        {widgetTypesController && (
          <div className="grid grid-cols-2 gap-6">
            {widgetTypesController.widgetTypes.map(type => {
              const widgetSizes = WIDGET_SIZE_MAP[type.widget_type]

              return (
                <div key={type.id} className="flex flex-col gap-3">
                  {type.alias}

                  <Button
                    onClick={() =>
                      widgetTypesController.onClick(widgetSizes[0], type)
                    }
                  >
                    Add widget
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Preview controller */}
        {previewController && (
          <Button
            size={'icon'}
            variant={previewController.isEnabled ? 'default' : 'outline'}
            onClick={previewController.onClick}
            className="hidden lg:flex lg:justify-center lg:items-center"
          >
            <Smartphone />
          </Button>
        )}
      </div>

      {/* RGL container */}
      <div className="flex justify-center items-center w-full">
        <div
          className={cn(
            'layout w-full border rounded-md bg-white lg:w-full w-[350px] min-h-[700px]',
            previewController?.isEnabled && 'w-[350px]! lg:border-10'
          )}
        >
          <RGL
            {...props}
            breakpoints={BREAKPOINT_MAP}
            cols={COL_MAP}
            draggableCancel=".no-drag"
            margin={{
              md: [30, 30],
              sm: [15, 15],
            }}
            containerPadding={[10, 10]}
          >
            {children}
          </RGL>
        </div>
      </div>
    </div>
  )
}

export default BoardRGL
