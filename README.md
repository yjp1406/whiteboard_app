# Collaborative Real-time Whiteboard

A sophisticated, multi-user whiteboard application built for seamless real-time collaboration. This project demonstrates high-performance canvas rendering, complex state management, and bi-directional socket communication.

🌐 **Live Demo:** [Open Whiteboard](https://whiteboard-eljrurhhx-yjp1406s-projects.vercel.app/)

## 🚀 Features

-   **Real-time Collaboration**: Multiple users can draw simultaneously with sub-100ms latency using Socket.io.
-   **Advanced Drawing Tools**:
    -   Freehand Pencil (Smooth bezier-like paths)
    -   Geometric Shapes (Lines, Rectangles)
    -   High-accuracy Eraser
-   **Professional Canvas Engine**:
    -   High-DPI/Retina display support (Auto-scaling)
    -   Responsive layout with `ResizeObserver`
    -   RoughJS integration for aesthetic, hand-drawn styles
-   **Session & Permissions**:
    -   **Room Locking**: Hosts can lock the room to prevent guest modifications.
    -   **Persistent Sessions**: Reconnect to your room without losing your identity or host status.
    -   **Export**: Save your collaborative work as high-quality PNG images.
-   **State Management**: Full Undo/Redo history across all drawing actions.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Canvas API, RoughJS, Bootstrap, Socket.io-client.
-   **Backend**: Node.js, Express, Socket.io.
-   **Animations**: CSS3 transitions and Glassmorphism UI.

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/whiteboard-app.git
cd whiteboard-app
```

### 2. Setup Backend
```bash
cd Backend
npm install
npm start
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
# Create a .env file if needed (see Deployment Guide)
npm run dev
```

Built with ❤️ for a better collaborative experience.
