import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUser } from "@/lib/auth"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Heading } from "@/components/ui/heading"
import { isFirebaseAuthError } from "@/firebase"

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "メールアドレスの形式が正しくありません",
    })
    .min(2, {
      message: "ユーザー名は2文字以上で入力して下さい",
    })
    .max(50, {
      message: "ユーザー名は50文字以下で入力して下さい",
    }),
  // TODO: パスワード入力のバリデーション
  password: z.string().min(2).max(6),
})

export default function SignIn() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createUser(values)
      navigate("/")
    } catch (e) {
      // type guard as Firebase Error
      if (isFirebaseAuthError(e)) {
        switch (e.code) {
          case "auth/email-already-in-use":
            toast({
              title: "新規作成エラー",
              description: "既に登録されているメールアドレスです",
            })
            return
        }
      }
    }
  }

  return (
    <div className="p-8 w-[480px]">
      <Heading>Register</Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    id="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isValid}>
            Register
          </Button>
        </form>
      </Form>
      <Button variant="ghost" asChild>
        <Link to="/sign-in">sign-in</Link>
      </Button>
    </div>
  )
}
