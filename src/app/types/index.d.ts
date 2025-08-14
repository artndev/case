declare global {
  export type Dictionary<T> = {
    [key: string]: T
  }

  export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>
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
