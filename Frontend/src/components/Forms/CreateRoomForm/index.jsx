import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const CreateRoomForm = ({uuid, socket, setUser}) => {

    const [roomId, setRoomId] = useState(uuid());
    const [name,setName] = useState('');

    const navigate = useNavigate();

    const handleCreateRoom = (e) => {
        e.preventDefault();
        const roomData = {
            roomId,
            name,
            userId: uuid(),
            host:true,
            presenter: true
        }
        setUser(roomData);
        navigate(`/${roomId}`);
    }
    return (
        <form className="form col-md-12 mt-5">
            <div className="mb-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Enter your name" />
            </div>
            <div className="form-group border mb-3">
                <div className="input-group d-flex align-items-center">
                    <input type="text" value={roomId} className="form-control my-2 border-0" disabled placeholder="Generate room code" />
                    <div className="input-group-append d-flex gap-1">
                        <button className="btn btn-primary btn-sm me-1" type="button" onClick={() => setRoomId(uuid())}>generate</button>
                        <button className="btn btn-outline-danger btn-sm me-2" type="button">copy</button>
                    </div>
                </div>
            </div>
            <button type="submit" onClick={handleCreateRoom} className="btn btn-primary form-control">Create Room</button>
        </form>
    )
}

export default CreateRoomForm;