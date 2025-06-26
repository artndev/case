import type { UseFormSetError } from 'react-hook-form'

declare global {
  export interface ILoginFormProps {
    onSubmit: ({ formData, setError }: TLoginFormSubmit) => void
    err?: {
      message: string
      answer: any
    }
  }
}

export {}
