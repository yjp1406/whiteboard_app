import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoomForm = ({socket, setUser, uuid}) => {
    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const handleJoinRoom = (e) => {
        e.preventDefault();

        const roomData = {
            roomId,
            name,
            userId: uuid(),
            host: false,
            presenter: false
        }
        setUser(roomData);
        console.log("Joining room with data:", roomData);
        
        navigate(`/${roomId}`);
        socket.emit('userJoined', roomData);
    }

    return (
        <form className="form col-md-12 mt-5">
            <div className="mb-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Enter your name" />
            </div>
            <div className="form-group mb-3">
                    <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="form-control my-2" placeholder="Enter room code" />
            </div>
            <button type="submit" onClick={handleJoinRoom} className="btn btn-primary form-control">Join Room</button>
        </form>
    )
}

export default JoinRoomForm;