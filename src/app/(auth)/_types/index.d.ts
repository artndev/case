export interface I_FormProps<T> {
  onSubmit: (formData: FormData) => Promise<void>
  defaultValues?: T
}

export {}
