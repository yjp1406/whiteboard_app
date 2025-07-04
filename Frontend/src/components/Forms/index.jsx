import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";

const Forms = () => {
    return (
        <div className='row h-100'>
            <div className='col-md-4 mt-5 form-box py-3 px-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center'>
                <h1 className="text-primary fw-bold">Create Room</h1>
                <CreateRoomForm />
            </div>  
            <div className='col-md-4 mt-5 form-box py-3 px-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center'>
                <h1 className="text-primary fw-bold">Join Room</h1>
                <JoinRoomForm />
                </div>
        </div>
    )
}

export default Forms;