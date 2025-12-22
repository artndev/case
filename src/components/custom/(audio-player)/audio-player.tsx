'use client'

import { I_AudioPlayerProps } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { FFT_SIZE } from '@/lib/config'
import React, { useEffect, useState } from 'react'
import useAudioPlayer from './_hooks/use-audio-player'
import FrequencyChart from './frequency-chart'
import { Pause, Play } from 'lucide-react'

const AudioPlayer: React.FC<I_AudioPlayerProps> = ({ volume = 0.25 }) => {
  const {
    isPlaying,
    isLoading,
    freqs,
    toggle,
    seek,
    percentComplete,
    audioBuffer,
  } = useAudioPlayer('Feather.mp3')
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // const testData = new Uint8Array(new Array(256).fill(0).map((_, i) => i)) // 0..255

  useEffect(() => {
    if (isDragging) {
      return
    }

    setSliderValue(percentComplete)
  }, [percentComplete])

  return (
    <>
      {!isLoading && (
        <div className="flex gap-3 items-center">
          <Button
            className="rounded-full hover:scale-95"
            size={'icon'}
            onClick={() => toggle()}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>

          <Slider
            className="max-w-[200px] hover:cursor-pointer"
            defaultValue={[0]}
            value={[sliderValue]}
            max={100}
            step={1}
            onValueChange={value => setSliderValue(value[0])}
            onValueCommit={value => {
              const timeInSeconds = (audioBuffer!.duration / 100) * value[0]

              seek(timeInSeconds)
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerDown={() => setIsDragging(true)}
          />

          <FrequencyChart className="" data={freqs} dataSize={FFT_SIZE / 2} />
        </div>
      )}
    </>
  )
}

export default AudioPlayer
