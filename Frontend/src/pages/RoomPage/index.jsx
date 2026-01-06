import Whiteboard from "../../components/Whiteboard";
import "./index.css";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../../Socket';

const RoomPage = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const joinRoom = () => {
      if (user) {
        const joinData = { ...user, roomId };
        socket.emit("userJoined", joinData);
      }
    };

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("room-locked", (locked) => {
      setIsLocked(locked);
    });

    socket.on("connect", joinRoom);
    
    joinRoom();
    socket.emit("get-users", roomId);

    return () => {
      socket.off("allUsers");
      socket.off("room-locked");
      socket.off("connect", joinRoom);
    };
  }, [user, roomId]);

  // Redirect if no user data after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        console.warn("No user found, redirecting to home to join room...");
        navigate("/"); 
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [user, roomId, navigate]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
    socket.emit("clear", { roomId });
  };

  const handleToggleLock = () => {
    const newLockStatus = !isLocked;
    socket.emit("toggle-lock", { roomId, locked: newLockStatus });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `whiteboard-${roomId}.png`;
    link.click();
  };

  const undo = () => {
    if (elements.length > 0) {
      setHistory((prev) => [...prev, elements[elements.length - 1]]);
      const newElements = elements.slice(0, -1);
      setElements(newElements);
      socket.emit("elements-update", { elements: newElements, roomId });
    }
  };

  const redo = () => {
    if (history.length > 0) {
      const lastUndone = history[history.length - 1];
      const newElements = [...elements, lastUndone];
      setElements(newElements);
      setHistory((prev) => prev.slice(0, -1));
      socket.emit("elements-update", { elements: newElements, roomId });
    }
  };

  const isHost = user?.host || false;

  return (
    <div className="room-container">
      <header className="whiteboard-header">
        <h1 className="whiteboard-title">Whiteboard Collaboration</h1>
        <div className="d-flex align-items-center gap-2">
          {isHost && (
            <button 
              className={`btn ${isLocked ? 'btn-danger' : 'btn-outline-secondary'} action-btn`}
              onClick={handleToggleLock}
              title={isLocked ? "Unlock Room" : "Lock Room"}
            >
              <i className={`bi ${isLocked ? 'bi-lock-fill' : 'bi-unlock-fill'} me-1`}></i>
              {isLocked ? "Locked" : "Lock Room"}
            </button>
          )}
          <button className="btn btn-outline-primary action-btn" onClick={handleDownload} title="Export as PNG">
            <i className="bi bi-download me-1"></i>
            Export
          </button>
          <button 
            className="users-online btn border-0 d-flex align-items-center"
            onClick={() => setShowUsers(!showUsers)}
          >
            <i className="bi bi-people-fill me-2"></i>
            {users.length} Users Online
          </button>
          <button className="btn btn-outline-danger action-btn" onClick={handleClearCanvas}>
            <i className="bi bi-trash3-fill me-2"></i>
            Clear Board
          </button>
        </div>
      </header>

      {showUsers && (
        <div className="users-sidebar">
          <div className="sidebar-header">
            <h3>Participants</h3>
            <button onClick={() => setShowUsers(false)} className="btn-close"></button>
          </div>
          <div className="sidebar-content">
            {users.map((userItem) => (
              <div key={userItem.userId} className="user-item">
                <div className="user-avatar">{userItem.name ? userItem.name[0].toUpperCase() : "?"}</div>
                <div className="user-info">
                  <span className="user-name">{userItem.name} {userItem.userId === user?.userId && "(You)"}</span>
                  {userItem.host && <span className="host-badge">Host</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="canvas-wrapper">
        <div className="canvas-inner">
          <Whiteboard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
            roomId={roomId}
            user={user}
            isLocked={isLocked}
            onDrawStart={() => setHistory([])}
          />
          {isLocked && !isHost && (
            <div className="lock-overlay">
              <div className="lock-message">
                <i className="bi bi-lock-fill fs-1 mb-2"></i>
                <p>Room is locked by the host</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="toolbar-container">
        <div className="tool-group">
          <button 
            className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`} 
            onClick={() => setTool('pencil')}
            title="Pencil"
            disabled={isLocked && !isHost}
          >
            <i className="bi bi-pencil-fill fs-5"></i>
          </button>
          <button 
            className={`tool-btn ${tool === 'line' ? 'active' : ''}`} 
            onClick={() => setTool('line')}
            title="Line"
            disabled={isLocked && !isHost}
          >
            <i className="bi bi-slash-lg fs-5"></i>
          </button>
          <button 
            className={`tool-btn ${tool === 'rect' ? 'active' : ''}`} 
            onClick={() => setTool('rect')}
            title="Rectangle"
            disabled={isLocked && !isHost}
          >
            <i className="bi bi-square fs-5"></i>
          </button>
          <button 
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} 
            onClick={() => setTool('eraser')}
            title="Eraser"
            disabled={isLocked && !isHost}
          >
            <i className="bi bi-eraser-fill fs-5"></i>
          </button>
        </div>

        <div className="tool-group">
          <div className="color-picker-wrapper">
            <div className="color-dot" style={{ backgroundColor: color }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isLocked && !isHost}
              />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6c757d' }}>Color</span>
          </div>
        </div>

        <div className="tool-group">
          <button 
            className="tool-btn" 
            onClick={undo}
            disabled={elements.length === 0 || (isLocked && !isHost)}
            title="Undo"
          >
            <i className="bi bi-arrow-90deg-left fs-5"></i>
          </button>
          <button 
            className="tool-btn" 
            onClick={redo}
            disabled={history.length === 0 || (isLocked && !isHost)}
            title="Redo"
          >
            <i className="bi bi-arrow-90deg-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
