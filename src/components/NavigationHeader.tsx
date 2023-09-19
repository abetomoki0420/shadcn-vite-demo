import { useAuth } from "@/auth/hooks"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"

export const NavigationHeader = () => {
  const { user } = useAuth()

  return (
    <div className="flex justify-between">
      <h2>Chat</h2>
      <div className="flex">
        <div>{user?.email}</div>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    </div>
  )
}
