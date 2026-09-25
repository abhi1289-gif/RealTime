# RealTime

## 🚀 Real-Time Collaborative Code Editor

RealTime is a web-based collaborative code editor designed to allow multiple users to write, edit, and share code together in real time.

The application provides a shared coding workspace where users can create a room, share the room code with teammates, and collaborate on the same code simultaneously. Every change made in the editor is transmitted through a real-time communication channel and reflected in the editors of other users connected to the same room.

The project was built to understand and implement real-time communication in a full-stack web application using **React, Node.js, Express, Socket.IO, and Monaco Editor**.

---

## 🌐 Live Demo

**Try RealTime here:**

[https://frontend-zeta-rouge-44.vercel.app/](https://frontend-zeta-rouge-44.vercel.app/)

---

## 📖 About the Project

Traditional code editors are mainly designed for individual development. When multiple people need to work on the same piece of code, they often have to share files, use screen sharing, or rely on external collaboration tools.

RealTime provides a simple solution by creating a shared online coding environment.

A user can:

1. Enter their username.
2. Create a new coding room.
3. Receive a unique room code.
4. Share the room code with other users.
5. Allow other users to join the same room.
6. Edit code together in real time.
7. See the other connected collaborators in the room.

The project uses **Socket.IO** to establish persistent, bidirectional communication between the browser and the server.

---

## ✨ Features

### 🏠 Room Creation

Users can create a new coding room with a unique room code.

### 🔗 Join Existing Rooms

Users can enter a room code shared by another user and join the same collaborative workspace.

### 👤 Usernames

Every user enters a username before joining a room. The username is displayed in the collaborators section.

### 👥 Live Collaborators

The application maintains a list of users currently connected to the room.

Users can see:

- Username
- Online status
- Current user indicator
- Room owner indicator

### ⚡ Real-Time Code Synchronization

When a user modifies the code, the changes are sent to the backend through Socket.IO and broadcast to other users in the same room.

This allows multiple users to work on the same code without manually refreshing or sharing updated files.

### 📝 Monaco Editor

RealTime uses **Monaco Editor**, the same editor technology that powers Visual Studio Code.

It provides features such as:

- Syntax highlighting
- Code editing
- Line numbers
- Minimap
- Automatic layout
- Smooth scrolling
- Dark theme
- JavaScript language support

### 📋 Room Code Sharing

Users can copy the room ID using the built-in copy button and share it with their teammates.

### 🔴 Live Connection

The room interface provides a live status indicator to represent the collaborative session.

### 🌙 Dark UI

The application uses a dark, developer-focused interface designed for comfortable coding.

---

# 🛠️ Tech Stack

## Frontend

- **React.js** – Building the user interface
- **Vite** – Frontend development and build tooling
- **React Router** – Client-side routing
- **Monaco Editor** – Code editor
- **Socket.IO Client** – Real-time communication
- **CSS** – Custom styling

## Backend

- **Node.js** – Server-side JavaScript runtime
- **Express.js** – Backend server framework
- **Socket.IO** – Real-time bidirectional communication
- **CORS** – Cross-origin communication between frontend and backend

## Deployment

- **Vercel** – Frontend deployment
- **Render** – Backend deployment
- **GitHub** – Source code management

---

# 🏗️ Project Architecture

The project follows a separate frontend and backend architecture.

```text
                    RealTime
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend                   Backend
      React + Vite              Node.js
          │                     Express
          │                     Socket.IO
          │                         │
          └──────── Socket.IO ──────┘
```
---

## 👨‍💻 Author

**Abhishek Sonparote**
