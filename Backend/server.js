const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hii")});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
  
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");   
