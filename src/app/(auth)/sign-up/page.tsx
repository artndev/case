import { SignUpForm } from '../_components/sign-up-form'
import { signUp } from '../actions'

export default function SignInPage() {
  return <SignUpForm onSubmit={signUp} />
}
