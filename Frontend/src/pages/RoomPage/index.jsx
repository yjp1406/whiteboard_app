import Whiteboard from "../../components/Whiteboard";
import "./index.css";
import { useRef, useState } from "react";

const RoomPage = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  return (
    <div className="row">
      <h1 className="text-center py-5">
        White Board <span className="text-primary">[Users Online : 0]</span>
      </h1>
      <div className="col-md-10 mx-auto gap-3 px-5 mb-5 d-flex align-items-center justify-content-center">
        <div className="d-flex col-md-2 justify-content-center gap-2">
          <div className="d-flex gap-1 align-items-center">
            <label htmlFor="pencil">Pencil</label>
            <input
              type="radio"
              id="pencil"
              name="tool"
              value="pencil"
              checked={tool == "pencil"}
              className=""
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="d-flex gap-1 align-items-center">
            <label htmlFor="line">Line</label>
            <input
              type="radio"
              id="line"
              name="tool"
              value="line"
              checked={tool == "line"}
              className=""
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="d-flex gap-1 align-items-center">
            <label htmlFor="rect">Reactangle</label>
            <input
              type="radio"
              id="rect"
              name="tool"
              value="rect"
              checked={tool == "rect"}
              className=""
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="d-flex gap-1 align-items-center">
            <label htmlFor="eraser" title="Eraser">
              <i className="bi bi-eraser-fill fs-5"></i>
            </label>
            <input
              type="radio"
              id="eraser"
              name="tool"
              value="eraser"
              checked={tool === "eraser"}
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 mx-auto">
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor="color">Select Color:</label>
            <input
              type="color"
              id="color"
              className="ms-3"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 d-flex gap-2">
          <button className="btn btn-primary mt-1">Undo</button>
          <button className="btn btn-outline-primary mt-1">Redo</button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-danger" onClick={handleClearCanvas}>
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="col-md-10 mx-auto h-100">
        <Whiteboard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
        />
      </div>
    </div>
  );
};

export default RoomPage;
