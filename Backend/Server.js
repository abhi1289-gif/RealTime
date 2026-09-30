import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

const app = express()

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173"

app.use(cors({
  origin: FRONTEND_URL,
}))

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
})


/* =========================================================
   ROOM DATA
========================================================= */

const userRooms = new Map()
const userNames = new Map()

// Code rooms
const roomCodes = new Map()

// Whiteboard rooms
const whiteboardData = new Map()

// Stores whether a room is code or whiteboard
const roomTypes = new Map()


/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", (socket) => {

  console.log("User connected:", socket.id)


  /* =======================================================
     CODE ROOM
  ======================================================= */

socket.on("join-room", ({ roomId, username }) => {

  console.log(
    "JOIN ROOM EVENT:",
    {
      socketId: socket.id,
      roomId,
      username,
    }
  )

  roomTypes.set(roomId, "code")

  socket.join(roomId)

  userRooms.set(socket.id, roomId)
  userNames.set(socket.id, username)

  console.log(
    `${username} (${socket.id}) joined room ${roomId}`
  )

  const room =
    io.sockets.adapter.rooms.get(roomId)

  const users = room
    ? Array.from(room).map((userId) => ({
        id: userId,
        username:
          userNames.get(userId) || "Guest",
      }))
    : []

  console.log(
    "USERS IN ROOM:",
    roomId,
    users
  )

  io.to(roomId).emit(
    "room-users",
    users
  )

  if (roomCodes.has(roomId)) {
    socket.emit(
      "code-update",
      roomCodes.get(roomId)
    )
  }
})


  /* =======================================================
     CODE CHANGE
  ======================================================= */

  socket.on(
    "code-change",
    ({ roomId, code }) => {

      console.log(
        `Code changed in room: ${roomId}`
      )

      roomCodes.set(roomId, code)

      socket
        .to(roomId)
        .emit("code-update", code)

    }
  )


  /* =======================================================
     WHITEBOARD JOIN
  ======================================================= */

socket.on(
  "join-whiteboard",
  ({ roomId, username }) => {

    console.log("================================")
    console.log("WHITEBOARD JOIN EVENT")
    console.log("Socket ID:", socket.id)
    console.log("Room ID:", roomId)
    console.log("Username:", username)
    console.log("================================")

    roomTypes.set(roomId, "whiteboard")

    socket.join(roomId)

    userRooms.set(
      socket.id,
      roomId
    )

    userNames.set(
      socket.id,
      username
    )

    console.log(
      `${username} (${socket.id}) joined whiteboard ${roomId}`
    )

    const room =
      io.sockets.adapter.rooms.get(roomId)

    const users = room
      ? Array.from(room).map((userId) => ({
          id: userId,
          username:
            userNames.get(userId) || "Guest",
        }))
      : []

    console.log(
      "WHITEBOARD USERS:",
      users
    )

    io.to(roomId).emit(
      "room-users",
      users
    )

    const existingData =
      whiteboardData.get(roomId) || []

    socket.emit(
      "whiteboard-state",
      existingData
    )
  }
)

  /* =======================================================
     WHITEBOARD DRAW
  ======================================================= */

  socket.on(
    "whiteboard-draw",
    ({ roomId, line }) => {

      if (!whiteboardData.has(roomId)) {

        whiteboardData.set(
          roomId,
          []
        )

      }


      whiteboardData
        .get(roomId)
        .push(line)


      // Send drawing to everyone
      // except sender

      socket
        .to(roomId)
        .emit(
          "whiteboard-draw",
          line
        )

    }
  )


  /* =======================================================
     WHITEBOARD CLEAR
  ======================================================= */

  socket.on(
    "whiteboard-clear",
    ({ roomId }) => {

      whiteboardData.set(
        roomId,
        []
      )


      // Clear everyone's canvas

      io.to(roomId).emit(
        "whiteboard-clear"
      )

    }
  )


  /* =======================================================
     DISCONNECT
  ======================================================= */

  socket.on("disconnect", () => {

    const roomId =
      userRooms.get(socket.id)

    const username =
      userNames.get(socket.id)


    console.log(
      `${username || "User"} disconnected:`,
      socket.id
    )


    if (roomId) {

      userRooms.delete(
        socket.id
      )

      userNames.delete(
        socket.id
      )


      const room =
        io.sockets.adapter.rooms.get(
          roomId
        )


      const users = room
        ? Array.from(room).map((userId) => ({
            id: userId,
            username:
              userNames.get(userId) ||
              "Guest",
          }))
        : []


      io.to(roomId).emit(
        "room-users",
        users
      )


      // Delete room data when
      // everyone has left

      if (!room || room.size === 0) {

      roomCodes.delete(roomId)

      whiteboardData.delete(roomId)

      roomTypes.delete(roomId)

    }

    }

  })

})

app.get("/room/:roomId/type", (req, res) => {

  const { roomId } = req.params

  const type = roomTypes.get(roomId)

  if (!type) {

    return res.status(404).json({
      message: "Room not found",
    })

  }

  res.json({
    type,
  })

})


/* =========================================================
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 5000


server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Socket.IO server running on port ${PORT}`
    )

  }
)