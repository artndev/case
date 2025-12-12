import React, { useMemo, useState } from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import { I_FrequencyChartProps, T_Point, T_Size } from './_types'

const FrequencyChart: React.FC<I_FrequencyChartProps> = ({
  data,
  dataSize,
}) => {
  const [size, setSize] = useState<T_Size>({ width: 400, height: 200 })

  const barWidth = size.width / (512 / 2 / 32) - 5

  const points = useMemo(() => {
    const p: T_Point[] = []

    for (let i = 0; i < 512 / 2; i += 32) {
      let runningTotal = 0

      for (let j = i; j < i + 32; j++) {
        runningTotal += data[j] ?? 0
      }

      const average = runningTotal / 32
      const x = (i / 32) * (barWidth + 5)
      const y1 = Math.round(
        Math.max((average / Math.max(...data, 1)) * size.height, 10)
      ) // Height of bar
      const y2 = size.height - y1
      const color = 'black'

      console.log(size.height - y1)

      p.push({ x, y1, y2, color })
    }

    return p
  }, [size, data, dataSize])

  return (
    <Stage width={400} height={200} className="bg-red-500">
      <Layer>
        {points.map((point, index) => {
          return (
            <Rect
              key={index}
              x={point.x}
              y={point.y2}
              width={barWidth}
              height={point.y1}
              fill={point.color}
              cornerRadius={5}
            />
          )
        })}
      </Layer>
    </Stage>
  )
}

export default FrequencyChart
