import React, {
  useEffect,
  useRef,
  useState
} from "react"

import {
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom"

import { Editor } from "@monaco-editor/react"

import socket from "./socket"

import "./Room.css"


function Room() {

  const { roomId } = useParams()

  const navigate = useNavigate()

  const location = useLocation()


  // =========================
  // USERNAME
  // =========================

  const username =
    location.state?.username ||
    sessionStorage.getItem("username") ||
    "Guest"


  // =========================
  // STATE
  // =========================

  const [users, setUsers] = useState([])

  const [copied, setCopied] = useState(false)


  // Monaco editor reference
  const editorRef = useRef(null)


  // =========================
  // SAVE USERNAME
  // =========================

  useEffect(() => {

    sessionStorage.setItem(
      "username",
      username
    )

  }, [username])


  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {

    console.log(
      "Joining room as:",
      username
    )


    socket.emit("join-room", {
      roomId,
      username,
    })


    // USERS
    const handleUsers = (users) => {

      console.log(
        "Users in room:",
        users
      )

      setUsers(users)

    }


    // CODE
    const handleCodeUpdate = (newCode) => {

      console.log(
        "Received code update"
      )


      if (!editorRef.current) {
        return
      }


      const currentCode =
        editorRef.current.getValue()


      if (currentCode !== newCode) {

        editorRef.current.setValue(
          newCode
        )

      }

    }


    socket.on(
      "room-users",
      handleUsers
    )

    socket.on(
      "code-update",
      handleCodeUpdate
    )


    return () => {

      socket.off(
        "room-users",
        handleUsers
      )

      socket.off(
        "code-update",
        handleCodeUpdate
      )

    }

  }, [roomId, username])


  // =========================
  // MONACO MOUNT
  // =========================

  const handleEditorMount = (
    editor
  ) => {

    editorRef.current = editor

    console.log(
      "Monaco editor mounted"
    )

  }


  // =========================
  // CODE CHANGE
  // =========================

  const handleCodeChange = (
    value
  ) => {

    if (value === undefined) {
      return
    }


    console.log(
      "Sending code..."
    )


    socket.emit(
      "code-change",
      {
        roomId,
        code: value,
      }
    )

  }


  // =========================
  // COPY ROOM ID
  // =========================

  const copyRoomId = async () => {

    try {

      await navigator.clipboard
        .writeText(roomId)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)

    } catch (error) {

      console.error(
        "Failed to copy room ID:",
        error
      )

    }
  }


  return (

    <div className="room">

      {/* ================= HEADER ================= */}

      <header className="room-header">

        <div className="room-logo">

          <div className="room-logo-icon">
            R
          </div>

          <span>
            RealTime
          </span>

        </div>


        <div className="room-info">
          <span className="room-label">Room</span>

          <button className="room-code-button" onClick={copyRoomId}>
            <span className="room-id">{roomId}</span>
            <span className="copy-text">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>


        <div className="room-status">

          <span className="status-dot"></span>

          LIVE

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="room-main">


        {/* ================= SIDEBAR ================= */}

        <aside className="room-sidebar">

          <div className="sidebar-header">

            <span>
              COLLABORATORS
            </span>

            <span className="user-count">
              {users.length}
            </span>

          </div>


          <div className="users">

            {users.map(
              (user, index) => (

                <div
                  className={
                    user.id === socket.id
                      ? "user active-user"
                      : "user"
                  }
                  key={user.id}
                >

                  <div className="avatar avatar-blue">

                    {user.username
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>


                  <div className="user-details">

                    <span className="user-name">

                      {user.id === socket.id
                        ? `${user.username} (You)`
                        : user.username}

                    </span>


                    <span className="user-state">

                      {index === 0
                        ? "Owner"
                        : "Connected"}

                    </span>

                  </div>


                  <span className="online-dot"></span>

                </div>

              )
            )}

          </div>


          <div className="sidebar-bottom">

            <button
              className="leave-button"
              onClick={() =>
                navigate("/")
              }
            >
              ← Leave Room
            </button>

          </div>

        </aside>


        {/* ================= EDITOR ================= */}

        <section className="editor-section">


          <div className="editor-header">

            <div className="file-tab">

              <span className="js-icon">
                JS
              </span>

              <span>
                main.js
              </span>

            </div>


            <div className="editor-actions">

              <span className="language">
                JavaScript
              </span>

              <button className="run-button">
                ▶ Run
              </button>

            </div>

          </div>


          <div className="editor-container">

            <Editor

              height="100%"

              defaultLanguage="javascript"

              defaultValue={`// Welcome to RealTime 🚀

// Share this room with your teammates
// and start coding together.

function hello() {
    console.log("Hello World!");
}

hello();
`}

              theme="vs-dark"

              onMount={
                handleEditorMount
              }

              onChange={
                handleCodeChange
              }

              options={{

                fontSize: 15,

                minimap: {
                  enabled: true
                },

                padding: {
                  top: 20,
                  bottom: 20
                },

                smoothScrolling: true,

                cursorBlinking:
                  "smooth",

                automaticLayout:
                  true,

                scrollBeyondLastLine:
                  false,

                wordWrap:
                  "on",

              }}

            />

          </div>


          {/* ================= TERMINAL ================= */}

          <div className="terminal">

            <div className="terminal-header">

              <span className="terminal-active">
                TERMINAL
              </span>

              <span>
                OUTPUT
              </span>

              <span className="terminal-status">
                Ready
              </span>

            </div>


            <div className="terminal-content">

              <p>

                <span className="terminal-prompt">
                  $
                </span>

                {" "}
                Waiting for execution...

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>

  )
}


export default Room