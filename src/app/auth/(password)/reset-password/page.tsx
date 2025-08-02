import { ResetPasswordForm } from '@/app/auth/(password)/_components/reset-password-form'
import { resetPassword } from '../actions'

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ResetPasswordForm onSubmit={resetPassword} />
    </div>
  )
}
