import { io } from "socket.io-client"

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000"

console.log(
  "Connecting Socket.IO to:",
  SOCKET_URL
)

const socket = io(SOCKET_URL)

socket.on("connect", () => {

  console.log(
    "🟢 SOCKET CONNECTED:",
    socket.id
  )

})

socket.on("disconnect", (reason) => {

  console.log(
    "🔴 SOCKET DISCONNECTED:",
    reason
  )

})

socket.on("connect_error", (error) => {

  console.error(
    "❌ SOCKET ERROR:",
    error.message
  )

})

export default socket