const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // For production, you could restrict this to your Vercel/Netlify URL
  }
});
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hii")});

const users = {}; // { roomId: [ { userId, name, ... } ] }
const roomLocks = {}; // { roomId: boolean }

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const {roomId, name, userId, host, presenter} = data;
    socket.join(roomId);
    
    if (!users[roomId]) {
      users[roomId] = [];
    }
    
    const userIndex = users[roomId].findIndex(u => u.userId === userId);
    if (userIndex === -1) {
      users[roomId].push({ userId, name, host, presenter, socketId: socket.id });
    } else {
      users[roomId][userIndex].socketId = socket.id;
    }
    
    // Notify everyone in the room
    io.in(roomId).emit("allUsers", users[roomId]);
    
    socket.emit("userIsJoined", {"success": true})
    console.log(`${name} joined ${roomId}`);
  });

  socket.on("get-users", (roomId) => {
    if (users[roomId]) {
      socket.emit("allUsers", users[roomId]);
    }
  });

  socket.on("draw-element", ({ element, roomId }) => {
    socket.to(roomId).emit("receive-element", { element });
  });

  socket.on("elements-update", ({ elements, roomId }) => {
    socket.to(roomId).emit("receive-elements", { elements });
  });

  socket.on("clear", ({roomId}) => {
    socket.to(roomId).emit("clear-canvas");
  })

  socket.on("toggle-lock", ({ roomId, locked }) => {
    roomLocks[roomId] = locked;
    io.in(roomId).emit("room-locked", locked);
    console.log(`Room ${roomId} ${locked ? "locked" : "unlocked"}`);
  });

  socket.on("disconnect", () => {
    for (const roomId in users) {
      const index = users[roomId].findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        const user = users[roomId][index];
        users[roomId].splice(index, 1);
        io.in(roomId).emit("allUsers", users[roomId]);
        console.log(`${user.name} left ${roomId}`);
        if (users[roomId].length === 0) {
          delete users[roomId];
        }
        break;
      }
    }
  });
});
  
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");   const { log } = require("console");

