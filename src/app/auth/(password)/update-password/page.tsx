import { UpdatePasswordForm } from '@/app/auth/(password)/_components/update-password-form'
import { updatePassword } from '../actions'

export default function UpdatePasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <UpdatePasswordForm onSubmit={updatePassword} />
    </div>
  )
}
