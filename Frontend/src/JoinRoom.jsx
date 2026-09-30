import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./JoinRoom.css"

function JoinRoom() {

  const navigate = useNavigate()
  const location = useLocation()

  const username =
    location.state?.username ||
    sessionStorage.getItem("username") ||
    "Guest"

  const [roomCode, setRoomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  /* =====================================================
     JOIN ROOM
  ===================================================== */

  const handleJoinRoom = async () => {

    const code = roomCode
      .trim()
      .toUpperCase()

    const name = username.trim()


    if (!name) {
      setError("Username is required")
      return
    }


    if (!code) {
      setError("Enter a room code")
      return
    }


    setLoading(true)
    setError("")


    try {

      const response = await fetch(
        `${import.meta.env.VITE_SOCKET_URL}/room/${code}/type`
      )


      if (!response.ok) {

        setError("Room not found")

        setLoading(false)

        return
      }


      const data = await response.json()


      console.log(
        "Room type:",
        data.type
      )


      sessionStorage.setItem(
        "username",
        name
      )


      /* ===============================================
         WHITEBOARD ROOM
      =============================================== */

      if (data.type === "whiteboard") {

        navigate(
          `/whiteboard/${code}`,
          {
            state: {
              username: name,
            },
          }
        )

      }


      /* ===============================================
         CODE ROOM
      =============================================== */

      else {

        navigate(
          `/room/${code}`,
          {
            state: {
              username: name,
            },
          }
        )

      }

    } catch (error) {

      console.error(
        "Failed to join room:",
        error
      )

      setError(
        "Could not connect to the server"
      )

    } finally {

      setLoading(false)

    }
  }


  /* =====================================================
     ENTER KEY
  ===================================================== */

  const handleKeyDown = (event) => {

    if (event.key === "Enter") {
      handleJoinRoom()
    }

  }


  return (

    <div className="join-room-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="join-header">

        <div className="join-logo">

          <div className="join-logo-icon">
            R
          </div>

          <span>
            RealTime
          </span>

        </div>


        <button
          className="join-back"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="join-room-content">

        <div className="join-room-card">

          {/* ICON */}

          <div className="join-card-icon">
            →
          </div>


          {/* TITLE */}

          <h1>
            Join a <span>Room</span>
          </h1>


          <p>
            Enter the room code shared by your
            teammate to start collaborating.
          </p>


          {/* USERNAME */}

          <div className="join-user-info">

            <span>
              Joining as
            </span>

            <strong>
              {username}
            </strong>

          </div>


          {/* ROOM CODE */}

          <div className="join-input-group">

            <label>
              Room Code
            </label>

            <input
              type="text"
              value={roomCode}
              onChange={(event) => {
                setRoomCode(
                  event.target.value
                    .toUpperCase()
                )

                setError("")
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter 6-character code"
              maxLength={6}
              autoComplete="off"
              autoFocus
            />

          </div>


          {/* ERROR */}

          {error && (

            <div className="join-error">
              {error}
            </div>

          )}


          {/* BUTTON */}

          <button
            className="join-room-button"
            onClick={handleJoinRoom}
            disabled={
              loading ||
              !roomCode.trim()
            }
          >

            {loading
              ? "Joining..."
              : "Join Room"
            }

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>


          {/* INFO */}

          <div className="join-room-hint">

            <span className="join-hint-dot"></span>

            The room type will be detected automatically

          </div>

        </div>

      </main>

    </div>
  )
}

export default JoinRoom