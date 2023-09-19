import { createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import Register from "@/pages/Register"
import SignIn from "@/pages/SignIn"
import ChatRoom from "@/pages/ChatRoom"
import { PageNotFound } from "@/pages/404"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/rooms/:roomId",
    element: <ChatRoom />,
  },
])
