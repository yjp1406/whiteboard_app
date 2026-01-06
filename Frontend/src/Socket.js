import { io } from "socket.io-client";

const server = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ['websocket'],
};

const socket = io(server, connectionOptions);
export default socket;
