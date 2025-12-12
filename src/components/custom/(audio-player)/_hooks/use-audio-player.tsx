import { useCallback, useEffect, useRef, useState } from 'react'
import { getTrack } from './actions'
import { FFT_SIZE } from '@/lib/config'

const useAudioPlayer = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [freqs, setFreqs] = useState<Uint8Array>(new Uint8Array())

  const pausedTimeRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const audioAnalyserRef = useRef<AnalyserNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const audioBufferSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const toggle = useCallback(() => {
    if (isPlaying) {
      audioBufferSourceRef.current?.stop()
      pausedTimeRef.current = 0
      startTimeRef.current = 0
    } else {
      if (!audioContextRef.current || !audioAnalyserRef.current) {
        return
      }

      audioBufferSourceRef.current =
        audioContextRef.current.createBufferSource()
      audioBufferSourceRef.current.buffer = audioBufferRef.current!
      audioBufferSourceRef.current.connect(audioAnalyserRef.current)

      startTimeRef.current = audioContextRef.current.currentTime
      audioBufferSourceRef.current.start()

      requestAnimationFrame(draw)
    }

    setIsPlaying(prev => !prev)
  }, [isPlaying])

  const getCurrentPlaybackTime = () => {
    if (!audioContextRef.current) {
      return 0
    }

    if (isPlaying) {
      return (
        pausedTimeRef.current +
        (audioContextRef.current.currentTime - startTimeRef.current)
      )
    }

    return pausedTimeRef.current
  }

  const percentComplete =
    getCurrentPlaybackTime() / (audioBufferRef.current?.duration ?? 1)

  const draw = () => {
    if (!audioAnalyserRef.current) {
      return
    }

    const freqArrayLength = audioAnalyserRef.current.frequencyBinCount
    const freqsArray = new Uint8Array(freqArrayLength)
    audioAnalyserRef.current.getByteFrequencyData(freqsArray)

    setFreqs(freqsArray)

    requestAnimationFrame(draw)
  }

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    if (!audioAnalyserRef.current) {
      audioAnalyserRef.current = audioContextRef.current.createAnalyser()
      audioAnalyserRef.current.fftSize = FFT_SIZE
      audioAnalyserRef.current.smoothingTimeConstant = 0.8
      audioAnalyserRef.current.connect(audioContextRef.current.destination)
    }

    const fetchBuffer = async () => {
      setIsLoading(true)

      const track = await getTrack(src)
      audioBufferRef.current = await fetch(track!)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer =>
          audioContextRef.current!.decodeAudioData(arrayBuffer)
        )

      setIsLoading(false)
    }

    fetchBuffer()

    return () => {
      audioContextRef.current?.close()
    }
  }, [src])

  return {
    isPlaying,
    isLoading,
    freqs,
    toggle,
    percentComplete,
    audioBuffer: audioBufferRef.current,
  }
}

export default useAudioPlayer
