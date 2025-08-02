export interface I_FormProps
  extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: (formData: FormData) => Promise<void>
}

export {}
