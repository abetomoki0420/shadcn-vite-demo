import { ChatRoom, listenChatRoomById, listenChatRooms } from "@/chat/logics"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const useChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    const unsubscribe = listenChatRooms((rooms) => {
      setRooms(rooms)
    })

    return () => unsubscribe()
  }, [])

  return {
    rooms,
  }
}

export const useCurrentChatRoom = () => {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const { roomId } = useParams<{ roomId: string }>()

  useEffect(() => {
    if (!roomId) {
      return
    }
    const unsubscribe = listenChatRoomById(roomId, (room) => {
      setCurrentRoom(room)
    })

    return () => {
      unsubscribe()
    }
  }, [roomId])

  return {
    currentRoom,
  }
}
