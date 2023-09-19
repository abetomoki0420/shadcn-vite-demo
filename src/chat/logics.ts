import { db } from "@/firebase"
import {
  doc,
  collection,
  getDocs,
  FirestoreDataConverter,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore"
import { z } from "zod"

const roomCollectionId = "rooms"

export type ChatRoom = z.infer<typeof chatSchema>

const chatSchema = z.object({
  id: z.string(),
  members: z.string().array(),
  chats: z
    .object({
      email: z.string(),
      message: z.string(),
      createdAt: z.coerce.date(),
    })
    .array(),
})

const chatConverter: FirestoreDataConverter<ChatRoom> = {
  toFirestore(chatRoom) {
    return chatRoom
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)
    return chatSchema.parse({
      ...data,
      id: snapshot.id,
      chats: data.chats.map((data: { createdAt: { toDate: () => Date } }) => {
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
        }
      }),
    })
  },
}

const roomsRef = collection(db, roomCollectionId).withConverter(chatConverter)

export const getChatRoom = async (id: string) => {
  const ref = await getDoc(
    doc(db, roomCollectionId, id).withConverter(chatConverter)
  )
  return ref.data()
}

export const getChatRooms = async () => {
  const snapshot = await getDocs(roomsRef)
  return snapshot.docs.map((doc) => doc.data())
}

export const listenChatRooms = (callback: (rooms: ChatRoom[]) => void) => {
  return onSnapshot(roomsRef, (snapshot) => {
    callback(snapshot.docs.map((doc) => doc.data()))
  })
}

export const listenChatRoomById = (
  id: string,
  callback: (room: ChatRoom) => void
) => {
  return onSnapshot(
    doc(db, roomCollectionId, id).withConverter(chatConverter),
    (snapshot) => {
      const d = snapshot.data()
      if (!d) return
      callback(d)
    }
  )
}

export const enterChatRoom = async (id: string, user: { email: string }) => {
  const ref = doc(db, roomCollectionId, id)
  setDoc(ref, {
    members: [user.email],
  })
}

export const sendMessage = async ({
  roomId,
  user,
  message,
}: {
  roomId: string
  user: { email: string }
  message: string
}) => {
  const ref = doc(db, roomCollectionId, roomId)
  const room = await getDoc(ref.withConverter(chatConverter))
  const data = room.data()
  if (!data) return
  const chats = data.chats || []

  await setDoc(ref, {
    ...data,
    chats: [
      ...chats,
      {
        email: user.email,
        message,
        createdAt: new Date(),
      },
    ],
  })
}
