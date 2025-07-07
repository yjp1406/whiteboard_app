const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hii")});

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const {roomId, name, userId, host, presenter} = data;
    socket.join(roomId);
    socket.emit("userIsJoined", {"success": true})
    console.log(data);
  });
});
  
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");   
