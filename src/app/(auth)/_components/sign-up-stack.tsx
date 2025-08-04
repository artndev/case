'use client'

import ArrowButton from '@/components/custom/arrow-button'
import { useState } from 'react'
import { signInWithOAuth, signUp } from '../actions'
import { CaseNameForm } from './casename-form'
import { SignUpForm } from './sign-up-form'

const SignUpStack = () => {
  const [caseName, setCaseName] = useState<string>('')
  const [step, setStep] = useState<number>(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(Math.max(step - 1, 1))

  const handleCaseName = async (formData: FormData) => {
    setCaseName(formData.get('casename') as string)
    nextStep()
  }

  const handleSignUp = async (formData: FormData) => {
    formData.set('casename', caseName)
    signUp(formData)
  }

  const handleGoogleSignUp = async () => signInWithOAuth('google', caseName)

  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-12 p-6 md:p-10">
        {step === 1 && (
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <CaseNameForm
              onSubmit={handleCaseName}
              defaultValues={{ casename: caseName }}
            />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-3xl">
            <ArrowButton direction="left" onClick={() => prevStep()}>
              Back to casename
            </ArrowButton>
            <SignUpForm
              onSubmit={handleSignUp}
              onGoogleSubmit={handleGoogleSignUp}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default SignUpStack
