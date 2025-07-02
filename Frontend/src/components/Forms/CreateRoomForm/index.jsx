const CreateRoomForm = () => {
    return (
        <form className="form col-md-12 mt-5">
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Enter your name" />
            </div>
            <div className="form-group border mb-3">
                <div className="input-group d-flex align-items-center">
                    <input type="text" className="form-control my-2 border-0" disabled placeholder="Generate room code" />
                    <div className="input-group-append d-flex gap-1">
                        <button className="btn btn-primary btn-sm me-1" type="button">generate</button>
                        <button className="btn btn-outline-danger btn-sm me-2" type="button">copy</button>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary form-control">Create Room</button>
        </form>
    )
}

export default CreateRoomForm;