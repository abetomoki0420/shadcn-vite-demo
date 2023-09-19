import { useAuth } from "@/auth/hooks"
import { useCurrentChatRoom } from "@/chat/hooks"
import { sendMessage } from "@/chat/logics"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  message: z.string().min(1).max(50),
})

export default function ChatRoom() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      toast({
        title: "サインインして下さい",
      })
      navigate("/sign-in")
      return
    }
  })

  const { currentRoom } = useCurrentChatRoom()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "onBlur",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.email) {
      return
    }

    if (!currentRoom?.id) {
      return
    }

    try {
      await sendMessage({
        roomId: currentRoom?.id,
        user: {
          email: user.email,
        },
        message: values.message,
      })
    } finally {
      form.reset()
    }
  }

  return (
    <div>
      <Button asChild>
        <Link to="/">back to list</Link>
      </Button>
      <div>
        {currentRoom?.chats.map((chat, index) => (
          <div key={index} className="flex gap-2">
            <div>{chat.email}</div>
            <div>{chat.message}</div>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メッセージ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isValid}>
            Post
          </Button>
        </form>
      </Form>
    </div>
  )
}
