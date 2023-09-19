import { useAuth } from "@/auth/hooks"
import { useChat } from "@/chat/hooks"
import { NavigationHeader } from "@/components/NavigationHeader"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { rooms } = useChat()

  useEffect(() => {
    if (!user) {
      navigate("/sign-in")
      return
    }
  }, [user, navigate])

  return (
    <div>
      <NavigationHeader />
      <Heading>Home</Heading>
      {rooms.map((room) => (
        <Button asChild key={room.id}>
          <Link to={`rooms/${room.id}`}>{room.id}</Link>
        </Button>
      ))}
    </div>
  )
}
