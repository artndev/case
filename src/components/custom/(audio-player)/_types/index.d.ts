import { StageProps } from 'react-konva'

export interface I_FrequencyChartProps extends StageProps {
  data: Uint8Array
  dataSize: number
}

export type T_Size = {
  width: number
  height: number
  minHeight: number
}

export type T_Point = {
  x: number
  y1: number
  y2: number
  color: string
}

export {}
