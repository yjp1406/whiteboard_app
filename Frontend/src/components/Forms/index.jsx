import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";

const Forms = ({uuid, socket, setUser}) => {
    return (
        <div className="forms-container">
            <div className="form-wrapper">
                <h1 className="form-title">Collaborative Whiteboard</h1>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="form-box">
                            <h2 className="h4 fw-bold mb-4 text-center text-primary">Create Room</h2>
                            <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
                        </div>
                    </div>  
                    <div className="col-md-6">
                        <div className="form-box">
                            <h2 className="h4 fw-bold mb-4 text-center text-primary">Join Room</h2>
                            <JoinRoomForm socket={socket} uuid={uuid} setUser={setUser}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forms;