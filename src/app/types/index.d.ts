declare global {
  export type Dictionary<T> = {
    [key: string]: T
  }
}

export interface I_StatePayload {
  type: 'sign-in' | 'sign-up'
  casename?: string
}

export interface I_AxiosResponse<T> {
  message: string
  answer: T
}

export {}
