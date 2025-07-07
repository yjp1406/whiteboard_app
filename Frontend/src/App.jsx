import './App.css'
import Forms from './components/Forms';
import { Route, Routes } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const server = "localhost:3000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ['websocket'],
};

const socket = io(server, connectionOptions);

const App = () => {

  const [user,setUser] = useState(null);
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("User has joined the room successfully");
      }else {
        console.log("error in joining the room");
      }
    });
  }, []);
  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  return (
    <div className='container'>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
