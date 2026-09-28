import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./CreateRoom.css"

function generateRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

  let code = ""

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }

  return code
}

function CreateRoom() {
  const navigate = useNavigate()
  const location = useLocation()

  const username =
    location.state?.username ||
    sessionStorage.getItem("username") ||
    "Guest"

  const handleCreateRoom = () => {
    const roomCode = generateRoomCode()

    sessionStorage.setItem("username", username)

    navigate(`/room/${roomCode}`, {
      state: {
        username,
      },
    })
  }

  return (
    <div className="create-room-page">

      <header className="create-header">

        <div className="create-logo">
          <div className="create-logo-icon">
            R
          </div>

          <span>RealTime</span>
        </div>

        <button
          className="create-back"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

      </header>


      <main className="create-room-content">

        <div className="create-room-card">

          <div className="create-card-icon">
            +
          </div>

          <h1>
            Create a <span>Room</span>
          </h1>

          <p>
            Start a new collaborative coding session
            and invite your teammates to work together
            in a shared real-time editor.
          </p>

          <button
            className="create-room-button"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>

          <div className="room-code-hint">
            <span className="room-code-hint-dot"></span>
            A unique room code will be generated
          </div>

        </div>

      </main>

    </div>
  )
}

export default CreateRoom