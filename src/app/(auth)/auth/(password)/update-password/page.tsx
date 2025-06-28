import { UpdatePasswordForm } from '@/components/update-password-form'
import { GalleryVerticalEnd } from 'lucide-react'
import { updatePassword } from '../../../actions'

export default function UpdatePasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-sm">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Art Inc.
        </a>
        <UpdatePasswordForm onSubmit={updatePassword} />
      </div>
    </div>
  )
}
