import { AuthContext } from "@/auth/provider"
import { useContext } from "react"

export const useAuth = () => {
  const { user } = useContext(AuthContext)

  return { user }
}
