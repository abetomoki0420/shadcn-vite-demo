import { auth } from "@/firebase"
import { User } from "firebase/auth"
import { useEffect, useState, createContext, ReactNode } from "react"
export const AuthContext = createContext<{
  user: User | null
}>({
  user: null,
})

export const AuthProvider = ({
  children,
}: {
  children: ReactNode[] | ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((_user) => {
      if (!_user) {
        setUser(null)
      } else {
        setUser(_user)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  })

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
