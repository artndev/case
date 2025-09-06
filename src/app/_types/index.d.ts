import { User } from '@supabase/supabase-js'

declare global {
  export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>

  export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>

  export interface I_AxiosResponse<T> {
    message: string
    answer: T
  }
}

export interface I_StatePayload {
  type: 'sign-in' | 'sign-up'
  casename?: string
}

export interface I_AuthContext {
  user: User | undefined
  loading: boolean
}

export {}
