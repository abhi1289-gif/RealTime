import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {

  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  const [roomCode, setRoomCode] = useState('')

  const handleJoinRoom = () => {

  const code = roomCode.trim()

  if (!username.trim() || !code) {
    return
  }

  sessionStorage.setItem(
    "username",
    username.trim()
  )

  navigate(`/room/${code}`, {
    state: {
      username: username.trim()
    }
  })

}

  return (
    <div className="home">

      <header className="home-header">

        <div className="logo">
          <div className="logo-icon">R</div>
          <span>RealTime</span>
        </div>

        <p className="tagline">
          Collaborate. Code. Create.
        </p>

      </header>


      <main className="home-content">

        <h1>
          Real-time coding, <span>together.</span>
        </h1>

        <p className="home-description">
          Create a room and invite others, or join an existing room
          to start coding together.
        </p>

        <div className="username-section">
          <label>Your name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>


        <div className="room-options">

          {/* ================= CREATE ROOM ================= */}

          <div className="room-card create-card">    

          <div className="card-icon">
            +
          </div>

          <h2>Create Room</h2>

          <p>
            Start a new collaborative coding session and bring your
            team together in one shared workspace. Write, edit, and
            experiment with code in real-time while everyone stays
            synchronized.
          </p>

          <button
            className="room-button create-button"
            disabled={!username.trim()}
            onClick={() => {

              navigate("/create", {
                state: {
                  username: username.trim()
                }
              })

            }}
          >
            Create Room
          </button>

        </div>


          {/* ================= JOIN ROOM ================= */}

          <div className="room-card join-card">

            <div className="card-icon">
              →
            </div>

            <h2>Join Room</h2>

            <p>
              Enter the unique room code shared by your friend
              to join their coding session.
            </p>

            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="room-input"
            />

            <button
              className="room-button join-button"
              disabled={!username.trim() || !roomCode.trim()}
              onClick={handleJoinRoom}
            >
              Join Room
            </button>

          </div>

        </div>

      </main>


      <footer className="home-footer">
        <span>⚡</span>
        Built for real-time collaboration
      </footer>

    </div>
  )
}

export default Home