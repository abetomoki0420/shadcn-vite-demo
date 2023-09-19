import { auth } from "@/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

export const createUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  return await auth.signOut()
}
