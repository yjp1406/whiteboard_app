import './App.css'
import Forms from './components/Forms';
import { Route, Routes } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import { useState, useEffect } from 'react';
import socket from './Socket'; // instead of creating socket here

// import io from 'socket.io-client';

// const server = "localhost:3000";
// const connectionOptions = {
//   "force new connection": true,
//   reconnectionAttempts: "Infinity",
//   timeout: 10000,
//   transports: ['websocket'],
// };

// const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("whiteboard_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("whiteboard_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("whiteboard_user");
    }
  }, [user]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("User has joined the room successfully");
      } else {
        console.log("error in joining the room");
      }
    });

    return () => {
      socket.off("userIsJoined");
    };
  }, []);
  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  return (
    <div className='app-root'>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>} />
        <Route path="/:roomId" element={<RoomPage user={user}/>} />
      </Routes>
    </div>
  );
}

export default App;
