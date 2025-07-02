const JoinRoomForm = () => {
    return (
        <form className="form col-md-12 mt-5">
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Enter your name" />
            </div>
            <div className="form-group mb-3">
                    {/* <span className="input-group-text">Room ID</span> */}
                    <input type="text" className="form-control my-2" placeholder="Generate room code" />
            </div>
            <button type="submit" className="btn btn-primary form-control">Join Room</button>
        </form>
    )
}

export default JoinRoomForm;