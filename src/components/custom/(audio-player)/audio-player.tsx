'use client'

import { I_AudioPlayerProps } from '@/components/types'
import { Button } from '@/components/ui/button'
import React from 'react'
import useAudioPlayer from './_hooks/use-audio-player'
import FrequencyChart from './frequency-chart'
import { FFT_SIZE } from '@/lib/config'

const AudioPlayer: React.FC<I_AudioPlayerProps> = ({ volume = 0.25 }) => {
  const { isPlaying, isLoading, freqs, toggle, percentComplete, audioBuffer } =
    useAudioPlayer('Feather.mp3')

  // const testData = new Uint8Array(new Array(256).fill(0).map((_, i) => i)) // 0..255

  return (
    <>
      <div className="flex gap-3">
        <FrequencyChart data={freqs} dataSize={FFT_SIZE / 2} />

        <Button onClick={() => toggle()}>Toggle</Button>
      </div>

      {/* {!isLoading && (
        <div className="flex gap-3">
          <FrequencyChart data={freqs} dataSize={FFT_SIZE / 2} />

          <Button onClick={() => toggle()}>Toggle</Button>
        </div>
      )} */}
    </>
  )
}

export default AudioPlayer
