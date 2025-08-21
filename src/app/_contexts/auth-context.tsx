'use client'

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { I_AuthContext } from '../_types'

const AuthContext = createContext<I_AuthContext>({} as I_AuthContext)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        return
      }

      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthContext
