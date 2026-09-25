import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import { useLocation } from 'react-router-dom'

function CreateRoom() {
  const navigate = useNavigate()

  const location = useLocation()

const username = location.state?.username || 'Guest'  

  const generateRoomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

    let code = ''

    for (let i = 0; i < 6; i++) {
      code += characters.charAt(
        Math.floor(Math.random() * characters.length)
      )
    }

    return code
  }

const handleCreateRoom = () => {

  const roomCode = generateRoomCode()

  sessionStorage.setItem(
    "username",
    username
  )

  navigate(`/room/${roomCode}`, {
    state: {
      username
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

        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Home
        </button>

      </header>

      <main className="create-room-content">

        <div className="create-room-card">

          <div className="card-icon create-icon">
            +
          </div>

          <h1>Create a Room</h1>

          <p>
            Start a new collaborative coding session and invite
            your teammates to work together in a shared editor.
          </p>

          <button
            className="room-button create-button"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>

        </div>

      </main>

    </div>
  )
}

export default CreateRoom