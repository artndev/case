import { FFT_SIZE } from '@/lib/config'
import { clamp } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getTrack } from './actions'

const useAudioPlayer = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [freqs, setFreqs] = useState<Uint8Array>(new Uint8Array())

  const isPlayingRef = useRef<boolean>(isPlaying)
  const pausedTimeRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const audioAnalyserRef = useRef<AnalyserNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const audioBufferSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const startPlayback = (offset = 0) => {
    if (!audioBufferRef.current || !audioContextRef.current) {
      return
    }

    audioBufferSourceRef.current?.stop()
    audioBufferSourceRef.current = audioContextRef.current.createBufferSource()
    audioBufferSourceRef.current.buffer = audioBufferRef.current
    audioBufferSourceRef.current.connect(audioAnalyserRef.current!)

    startTimeRef.current = audioContextRef.current.currentTime
    pausedTimeRef.current = offset

    audioBufferSourceRef.current.start(0, offset)
    requestAnimationFrame(draw)
  }

  const toggle = () => {
    if (!audioBufferRef.current) {
      return
    }

    if (pausedTimeRef.current >= audioBufferRef.current.duration) {
      startPlayback()
      setIsPlaying(true)
      return
    }

    if (!isPlaying) {
      startPlayback(pausedTimeRef.current)
      setIsPlaying(true)
      return
    }

    pausedTimeRef.current = getCurrentPlaybackTime()
    audioBufferSourceRef.current?.stop()
    setIsPlaying(false)
  }

  const seek = (value: number) => {
    if (!audioBufferRef.current) {
      return
    }

    pausedTimeRef.current = clamp(value, 0, audioBufferRef.current.duration)

    if (!isPlaying) {
      return
    }

    startPlayback(pausedTimeRef.current)
  }

  const getCurrentPlaybackTime = () => {
    if (!audioContextRef.current || !audioBufferRef.current) {
      return 0
    }

    if (!isPlaying) {
      return pausedTimeRef.current
    }

    return clamp(
      pausedTimeRef.current +
        (audioContextRef.current.currentTime - startTimeRef.current),
      0,
      audioBufferRef.current.duration
    )
  }

  const percentComplete =
    getCurrentPlaybackTime() / (audioBufferRef.current?.duration ?? 1)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const draw = useCallback(() => {
    if (!audioAnalyserRef.current) {
      return
    }

    // TODO: Such an sharp animation is happening over here
    if (!isPlayingRef.current) {
      setFreqs(new Uint8Array(0))
      return
    }

    const freqArrayLength = audioAnalyserRef.current.frequencyBinCount
    const freqsArray = new Uint8Array(freqArrayLength)
    audioAnalyserRef.current.getByteFrequencyData(freqsArray)

    setFreqs(freqsArray)

    requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    if (!audioAnalyserRef.current) {
      audioAnalyserRef.current = audioContextRef.current.createAnalyser()
      audioAnalyserRef.current.fftSize = FFT_SIZE
      audioAnalyserRef.current.smoothingTimeConstant = 0.9
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
    seek,
    percentComplete: percentComplete * 100,
    audioBuffer: audioBufferRef.current,
  }
}

export default useAudioPlayer
