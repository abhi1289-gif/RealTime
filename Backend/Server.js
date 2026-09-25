import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

// socket.id -> roomId
const userRooms = new Map()

// socket.id -> username
const userNames = new Map()

// roomId -> current code
const roomCodes = new Map()


io.on("connection", (socket) => {

  console.log("User connected:", socket.id)


  // =========================
  // JOIN ROOM
  // =========================

  socket.on("join-room", ({ roomId, username }) => {

    socket.join(roomId)

    userRooms.set(socket.id, roomId)
    userNames.set(socket.id, username)

    console.log(
      `${username} (${socket.id}) joined room ${roomId}`
    )


    // Get all users in the room
    const room = io.sockets.adapter.rooms.get(roomId)

    const users = room
      ? Array.from(room).map((userId) => ({
          id: userId,
          username: userNames.get(userId) || "Guest",
        }))
      : []


    // Send users to everyone
    io.to(roomId).emit("room-users", users)


    // If room already has code,
    // send it ONLY to the new user
    if (roomCodes.has(roomId)) {

      socket.emit(
        "code-update",
        roomCodes.get(roomId)
      )

    }
  })


  // =========================
  // CODE CHANGE
  // =========================

  socket.on("code-change", ({ roomId, code }) => {

    console.log(
      `Code changed in room: ${roomId}`
    )

    // Save latest code
    roomCodes.set(roomId, code)

    // Send to everyone except sender
    socket.to(roomId).emit(
      "code-update",
      code
    )
  })


  // =========================
  // DISCONNECT
  // =========================

  socket.on("disconnect", () => {

    const roomId = userRooms.get(socket.id)

    const username = userNames.get(socket.id)

    console.log(
      `${username || "User"} disconnected:`,
      socket.id
    )


    if (roomId) {

      userRooms.delete(socket.id)
      userNames.delete(socket.id)


      const room = io.sockets.adapter.rooms.get(roomId)

      const users = room
        ? Array.from(room).map((userId) => ({
            id: userId,
            username: userNames.get(userId) || "Guest",
          }))
        : []


      io.to(roomId).emit(
        "room-users",
        users
      )


      // Delete empty room's code
      if (!room || room.size === 0) {
        roomCodes.delete(roomId)
      }
    }
  })
})


server.listen(5000, () => {

  console.log(
    "Socket.IO server running on port 5000"
  )

})