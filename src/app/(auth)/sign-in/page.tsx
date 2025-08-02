import { SignInForm } from '../_components/sign-in-form'
import { signIn } from '../actions'

export default function SignInPage() {
  return <SignInForm onSubmit={signIn} />
}
