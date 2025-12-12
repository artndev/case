import { GROUP_SIZE } from '@/lib/config'
import React, { useMemo } from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import { I_FrequencyChartProps, T_Point, T_Size } from './_types'

// Removed the last point because it displays the frequency bar that rarely fires
const FrequencyChart: React.FC<I_FrequencyChartProps> = ({
  data,
  dataSize,
}) => {
  const size: T_Size = {
    width: 20,
    height: 40,
    minHeight: 5,
  }
  const totalBars = dataSize / GROUP_SIZE - 1
  const barWidth = (size.width - 5 * (totalBars - 1)) / totalBars

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
        Math.max((average / Math.max(...data, 1)) * size.height, size.minHeight)
      ) // Height of bar
      const y2 = size.height - y1
      const color = 'black'

      p.push({ x, y1, y2, color })
    }

    return p
  }, [size, data, dataSize])

  return (
    <Stage width={size.width} height={size.height}>
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
  )
}

export default FrequencyChart
