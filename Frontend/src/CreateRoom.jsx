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

  const saveUsername = () => {
    sessionStorage.setItem("username", username)
  }

  // CODE ROOM
  const handleCreateCodeRoom = () => {
    const roomCode = generateRoomCode()

    saveUsername()

    navigate(`/room/${roomCode}`, {
      state: {
        username,
      },
    })
  }

  // WHITEBOARD ROOM
  const handleCreateWhiteboardRoom = () => {
    const roomCode = generateRoomCode()

    saveUsername()

    navigate(`/whiteboard/${roomCode}`, {
      state: {
        username,
      },
    })
  }

  return (
    <div className="create-room-page">

      {/* HEADER */}
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


      {/* MAIN */}
      <main className="create-room-content">

        <div className="create-room-wrapper">

          {/* TITLE */}
          <div className="create-room-heading">

            <span className="create-room-badge">
              COLLABORATIVE WORKSPACE
            </span>

            <h1>
              Create a <span>Room</span>
            </h1>

            <p>
              Choose how you want to collaborate with
              your teammates.
            </p>

          </div>


          {/* OPTIONS */}
          <div className="create-room-options">


            {/* CODE ROOM */}
            <div className="create-option-card code-room-card">

              <div className="create-option-icon">
                &lt;/&gt;
              </div>

              <div className="create-option-content">

                <h2>
                  Code Room
                </h2>

                <p>
                  Write and edit code together in a
                  real-time collaborative editor.
                </p>

              </div>

              <div className="create-option-features">

                <span>
                  ✓ Live code editing
                </span>

                <span>
                  ✓ Multiple collaborators
                </span>

                <span>
                  ✓ Monaco Editor
                </span>

              </div>

              <button
                className="create-room-button code-create-button"
                onClick={handleCreateCodeRoom}
              >
                Create Code Room
                <span>→</span>
              </button>

            </div>


            {/* WHITEBOARD ROOM */}
            <div className="create-option-card whiteboard-room-card">

              <div className="create-option-icon whiteboard-icon">
                ✦
              </div>

              <div className="create-option-content">

                <h2>
                  Whiteboard Room
                </h2>

                <p>
                  Draw, sketch, brainstorm and collaborate
                  visually with your teammates.
                </p>

              </div>

              <div className="create-option-features">

                <span>
                  ✓ Real-time drawing
                </span>

                <span>
                  ✓ Multiple collaborators
                </span>

                <span>
                  ✓ Interactive canvas
                </span>

              </div>

              <button
                className="create-room-button whiteboard-create-button"
                onClick={handleCreateWhiteboardRoom}
              >
                Create Whiteboard
                <span>→</span>
              </button>

            </div>


          </div>

          {/* ROOM CODE INFO */}
          <div className="room-code-hint">
            <span className="room-code-hint-dot"></span>

            A unique room code will be generated for your
            session

          </div>

        </div>

      </main>

    </div>
  )
}

export default CreateRoom