import { AuthProvider } from '../_contexts/auth-context'
import Board from './_components/board'

const BoardPage = () => {
  return (
    <AuthProvider>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <Board />
      </div>
    </AuthProvider>
  )
}

export default BoardPage
