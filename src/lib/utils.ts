import { clsx, type ClassValue } from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { T_BeautifyUrl } from './_types'

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max))
}

export const countNodes = (children: React.ReactNode): number => {
  return React.Children.count(children)
}

export const beautifyUrl = (url: string): T_BeautifyUrl => {
  const hostname = new URL(url).hostname
  const beautifiedUrl = hostname.startsWith('www')
    ? hostname.slice(4)
    : hostname

  return {
    source: url,
    noHttps: beautifiedUrl,
    noTLD:
      beautifiedUrl.charAt(0).toUpperCase() +
      beautifiedUrl.split('.')[0].slice(1),
  }
}
