import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import socket from "./socket"
import "./Whiteboard.css"

function Whiteboard() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const username =
    location.state?.username ||
    sessionStorage.getItem("username") ||
    "Guest"

  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const [users, setUsers] = useState([])
  const [tool, setTool] = useState("pen")
  const [color, setColor] = useState("#111827")
  const [brushSize, setBrushSize] = useState(4)
  const [copied, setCopied] = useState(false)

  const isDrawing = useRef(false)
  const lastPoint = useRef(null)

  /* =====================================================
     SAVE USERNAME
  ===================================================== */

  useEffect(() => {
    sessionStorage.setItem("username", username)
  }, [username])


  /* =====================================================
     CANVAS SETUP
  ===================================================== */

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext("2d")

    ctx.scale(dpr, dpr)

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, rect.height)
  }


  useEffect(() => {
    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])


/* =====================================================
   JOIN WHITEBOARD ROOM
===================================================== */

useEffect(() => {

  const joinWhiteboard = () => {

    console.log(
      "Joining whiteboard:",
      roomId,
      username
    )

    socket.emit("join-whiteboard", {
      roomId,
      username,
    })

  }


  // USERS
  const handleUsers = (users) => {

    console.log(
      "WHITEBOARD USERS RECEIVED:",
      users
    )

    setUsers(users)

  }


  // DRAW
  const handleDraw = (line) => {
    drawLine(line)
  }


  // CLEAR
  const handleClear = () => {
    clearCanvas()
  }


  // STATE
  const handleWhiteboardState = (lines) => {

    console.log(
      "WHITEBOARD STATE:",
      lines
    )

    lines.forEach((line) => {
      drawLine(line)
    })

  }


  /* ================================================
     LISTEN FIRST
  ================================================ */

  socket.on(
    "room-users",
    handleUsers
  )

  socket.on(
    "whiteboard-draw",
    handleDraw
  )

  socket.on(
    "whiteboard-clear",
    handleClear
  )

  socket.on(
    "whiteboard-state",
    handleWhiteboardState
  )


  /* ================================================
     JOIN ONLY AFTER SOCKET CONNECTS
  ================================================ */

  if (socket.connected) {

    joinWhiteboard()

  } else {

    socket.once(
      "connect",
      joinWhiteboard
    )

  }


  return () => {

    socket.off(
      "room-users",
      handleUsers
    )

    socket.off(
      "whiteboard-draw",
      handleDraw
    )

    socket.off(
      "whiteboard-clear",
      handleClear
    )

    socket.off(
      "whiteboard-state",
      handleWhiteboardState
    )

    socket.off(
      "connect",
      joinWhiteboard
    )

  }

}, [roomId, username])


  /* =====================================================
     DRAW LINE
  ===================================================== */

  const drawLine = (line) => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext("2d")

    ctx.beginPath()

    ctx.moveTo(line.x0, line.y0)

    ctx.lineTo(line.x1, line.y1)

    ctx.strokeStyle =
      line.tool === "eraser"
        ? "#ffffff"
        : line.color

    ctx.lineWidth = line.size

    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.stroke()
  }


  /* =====================================================
     GET CANVAS POSITION
  ===================================================== */

  const getPoint = (event) => {
    const canvas = canvasRef.current

    const rect = canvas.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }


  /* =====================================================
     START DRAWING
  ===================================================== */

  const startDrawing = (event) => {
    event.preventDefault()

    const point = getPoint(event)

    isDrawing.current = true
    lastPoint.current = point
  }


  /* =====================================================
     DRAWING
  ===================================================== */

  const drawing = (event) => {
    if (!isDrawing.current) return

    event.preventDefault()

    const point = getPoint(event)

    const line = {
      x0: lastPoint.current.x,
      y0: lastPoint.current.y,
      x1: point.x,
      y1: point.y,
      color,
      size: brushSize,
      tool,
    }

    drawLine(line)

    socket.emit("whiteboard-draw", {
      roomId,
      line,
    })

    lastPoint.current = point
  }


  /* =====================================================
     STOP DRAWING
  ===================================================== */

  const stopDrawing = () => {
    isDrawing.current = false
    lastPoint.current = null
  }


  /* =====================================================
     CLEAR CANVAS
  ===================================================== */

  const clearCanvas = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext("2d")

    const rect = canvas.getBoundingClientRect()

    ctx.clearRect(
      0,
      0,
      rect.width,
      rect.height
    )

    ctx.fillStyle = "#ffffff"

    ctx.fillRect(
      0,
      0,
      rect.width,
      rect.height
    )
  }


  const handleClear = () => {
    clearCanvas()

    socket.emit("whiteboard-clear", {
      roomId,
    })
  }


  /* =====================================================
     COPY ROOM ID
  ===================================================== */

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)

    } catch (error) {
      console.error("Failed to copy room ID:", error)
    }
  }


  return (
    <div className="whiteboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="whiteboard-header">

        <div className="whiteboard-logo">

          <div className="whiteboard-logo-icon">
            R
          </div>

          <span>RealTime</span>

        </div>


        <div className="whiteboard-room-info">

          <span className="whiteboard-room-label">
            Room
          </span>

          <button
            className="whiteboard-room-code"
            onClick={copyRoomId}
          >
            {roomId}

            <span>
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>

        </div>


        <div className="whiteboard-status">

          <span className="whiteboard-status-dot"></span>

          LIVE

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="whiteboard-main">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="whiteboard-sidebar">

          <div className="whiteboard-sidebar-header">

            <span>
              COLLABORATORS
            </span>

            <span className="whiteboard-user-count">
              {users.length}
            </span>

          </div>


          <div className="whiteboard-users">

            {users.map((user, index) => (

              <div
                className="whiteboard-user"
                key={user.id}
              >

                <div className="whiteboard-avatar">
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <div className="whiteboard-user-details">

                  <span>
                    {user.id === socket.id
                      ? `${user.username} (You)`
                      : user.username}
                  </span>

                  <small>
                    {index === 0
                      ? "Owner"
                      : "Connected"}
                  </small>

                </div>

                <span className="whiteboard-online"></span>

              </div>

            ))}

          </div>


          <div className="whiteboard-sidebar-bottom">

            <button
              onClick={() => navigate("/")}
            >
              ← Leave Room
            </button>

          </div>

        </aside>


        {/* =================================================
            CANVAS AREA
        ================================================= */}

        <section className="whiteboard-workspace">


          {/* TOOLBAR */}

          <div className="whiteboard-toolbar">

            <div className="toolbar-group">

              <button
                className={
                  tool === "pen"
                    ? "tool-button active"
                    : "tool-button"
                }
                onClick={() => setTool("pen")}
              >
                ✎
                <span>Pen</span>
              </button>


              <button
                className={
                  tool === "eraser"
                    ? "tool-button active"
                    : "tool-button"
                }
                onClick={() => setTool("eraser")}
              >
                ◇
                <span>Eraser</span>
              </button>

            </div>


            <div className="toolbar-divider"></div>


            {/* COLOR */}

            <div className="color-control">

              <span>Color</span>

              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                disabled={tool === "eraser"}
              />

            </div>


            {/* BRUSH SIZE */}

            <div className="size-control">

              <span>
                Size
              </span>

              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) =>
                  setBrushSize(Number(e.target.value))
                }
              />

              <span className="size-value">
                {brushSize}px
              </span>

            </div>


            <div className="toolbar-spacer"></div>


            {/* CLEAR */}

            <button
              className="clear-board-button"
              onClick={handleClear}
            >
              Clear Board
            </button>

          </div>


          {/* CANVAS */}

          <div
            className="whiteboard-canvas-container"
            ref={containerRef}
          >

            <canvas
              ref={canvasRef}

              onPointerDown={startDrawing}
              onPointerMove={drawing}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}

              className="whiteboard-canvas"
            />

          </div>

        </section>

      </main>

    </div>
  )
}

export default Whiteboard