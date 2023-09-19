import { initializeApp } from "firebase/app"
import { getAuth, AuthError } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "../firebase.config.ts"
// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const isFirebaseAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  )
}

export const db = getFirestore(app)
