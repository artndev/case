import { SignUpForm } from '../_components/sign-up-form'
import { signUp } from '../actions'

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUpForm onSubmit={signUp} />
      </div>
    </div>
  )
}
