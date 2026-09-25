import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './Home.jsx'
import CreateRoom from './CreateRoom.jsx'
import JoinRoom from './JoinRoom.jsx'
import Room from './Room.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  )
}