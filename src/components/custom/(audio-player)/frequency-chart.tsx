import { GROUP_SIZE } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import { I_FrequencyChartProps, T_Point, T_Size } from './_types'

// Removed the last point because it displays the frequency bar that rarely fires
const FrequencyChart: React.FC<I_FrequencyChartProps> = ({
  data,
  dataSize,
  className,
}) => {
  const [size, setSize] = useState<T_Size>({
    width: 0,
    height: 0,
    minHeight: 1,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const maxFreq = useMemo<number>(() => Math.max(...data, 1), [data])

  const totalBars = useMemo<number>(() => dataSize / GROUP_SIZE - 1, [dataSize])

  const barWidth = useMemo<number>(() => {
    if (totalBars === 0) {
      return 0
    }

    return (size.width - 5 * (totalBars - 1)) / totalBars
  }, [size.width, totalBars])

  const points = useMemo(() => {
    const p: T_Point[] = []

    for (let i = 0; i < dataSize; i += GROUP_SIZE) {
      let runningTotal = 0

      for (let j = i; j < i + GROUP_SIZE; j++) {
        runningTotal += data[j] ?? 0
      }

      const average = runningTotal / GROUP_SIZE
      const x = (i / GROUP_SIZE) * (barWidth + 5)
      const y1 = Math.round(
        Math.max((average / maxFreq) * size.height, size.minHeight)
      ) // Height of bar
      const y2 = size.height - y1
      const color = 'black'

      p.push({ x, y1, y2, color })
    }

    return p
  }, [size, barWidth, data, dataSize])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    setSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
      minHeight: 1,
    })
  }, [containerRef.current])

  return (
    <div ref={containerRef} className={cn('w-5 h-5', className)}>
      <Stage className="w-full h-full" width={size.width} height={size.height}>
        <Layer>
          {points.slice(0, -1).map((point, index) => {
            return (
              <Rect
                key={index}
                x={point.x}
                y={point.y2}
                width={barWidth}
                height={point.y1}
                fill={point.color}
                // cornerRadius={5}
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}

export default FrequencyChart
