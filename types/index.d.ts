import type { Provider } from '@supabase/supabase-js'
import type { UseFormSetError } from 'react-hook-form'

declare global {
  export interface I_AuthFormProps {
    onSubmit: (formData: FormData) => Promise<void>
    type: 'sign-in' | 'sign-up'
  }
}

export {}
