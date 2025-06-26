import type { UseFormSetError } from 'react-hook-form'

declare global {
  export interface ILoginFormProps {
    onSubmit: (formData: FormData) => Promise<void>
  }
}

export {}
