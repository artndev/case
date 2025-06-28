import type { Provider } from '@supabase/supabase-js'
import type { UseFormSetError } from 'react-hook-form'

declare global {
  export interface I_AuthFormProps {
    onSubmit: (formData: FormData) => Promise<any> | void
    type: 'sign-in' | 'sign-up'
  }

  export interface I_ResetFormProps {
    onSubmit: (formData: FormData) => Promise<any> | void
  }
}

export {}
