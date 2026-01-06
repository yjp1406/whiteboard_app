import { useState, useEffect, useLayoutEffect } from "react";
import rough from "roughjs";
import socket from '../../Socket'; // instead of creating socket here


const roughGenerator = rough.generator();

const Whiteboard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  roomId,
  user,
  isLocked,
  onDrawStart
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = parent;
      
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setCanvasSize({ width: clientWidth, height: clientHeight });
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(parent);
    resizeCanvas();

    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx || !canvas) return;

    // Clear
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element, index) => {
      if (element.type === "pencil") {
        ctx.strokeStyle = element.stroke;
        ctx.lineWidth = element.strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        const [first, ...rest] = element.path;
        if (first) {
          ctx.moveTo(first[0], first[1]);
          rest.forEach(([px, py]) => ctx.lineTo(px, py));
          ctx.stroke();
        }
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, strokeWidth: 5, roughness: 0 }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, strokeWidth: 5, roughness: 0 }
          )
        );
      }
    });
  }, [elements, canvasSize]);

  const broadcastElement = (element) => {
    socket.emit("draw-element", { element, roomId });
  };


  // Receive elements from others
  useEffect(() => {
    socket.on("receive-element", ({ element }) => {
      setElements((prev) => {
        const last = prev[prev.length - 1];
        if (
          last &&
          last.offsetX === element.offsetX &&
          last.offsetY === element.offsetY &&
          last.type === element.type
        ) {
          // Replace the last element with the updated one
          return [...prev.slice(0, -1), element];
        } else {
          // Add new element
          return [...prev, element];
        }
      });
    });

    socket.on("receive-elements", ({ elements }) => {
      setElements(elements);
    });

    return () => {
      socket.off("receive-element");
      socket.off("receive-elements");
    };
  }, [setElements]);


  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   ctx.clearRect(0,0,canvas.width, canvas.height);

  //   elements.forEach((element) => {
  //     drawElement(ctx, element);
  //   })
  // },[elements]);
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    // Permission check
    const isHost = user?.host || false;
    const isPresenter = user?.presenter || false;
    if (isLocked && !isHost && !isPresenter) {
      setIsDrawing(false);
      return;
    }

    const { x, y } = getCoordinates(e);

    setElements((prevElements) => {
      const lastElement = prevElements[prevElements.length - 1];
      if (!lastElement) return prevElements;

      let updatedEle;
      if (tool === "pencil" || tool === "eraser") {
        updatedEle = {
          ...lastElement,
          path: [...lastElement.path, [x, y]],
        };
      } else if (tool === "line") {
        updatedEle = {
          ...lastElement,
          width: x,
          height: y,
        };
      } else if (tool === "rect") {
        updatedEle = {
          ...lastElement,
          width: x - lastElement.offsetX,
          height: y - lastElement.offsetY,
        };
      }

      if (updatedEle) {
        broadcastElement(updatedEle);
        const newElements = [...prevElements];
        newElements[newElements.length - 1] = updatedEle;
        return newElements;
      }
      return prevElements;
    });
  };

  const handleMouseDown = (e) => {
    // Permission check
    const isHost = user?.host || false;
    const isPresenter = user?.presenter || false;
    if (isLocked && !isHost && !isPresenter) return;

    const { x, y } = getCoordinates(e);
    let newElement;
    if (tool === "pencil" || tool === "eraser") {
      newElement = {
        type: "pencil",
        offsetX: x,
        offsetY: y,
        path: [[x, y]],
        stroke: tool === "eraser" ? "#ffffff" : color,
        strokeWidth: tool === "eraser" ? 20 : 5,
      };
    } else {
      newElement = {
        type: tool,
        offsetX: x,
        offsetY: y,
        width: x,
        height: y,
        stroke: color,
      };
    }
    setElements((prev) => [...prev, newElement]);
    broadcastElement(newElement);
    setIsDrawing(true);
    if (onDrawStart) onDrawStart();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
      className="h-100 w-100 overflow-hidden position-relative"
      style={{ cursor: tool === 'pencil' ? 'crosshair' : 'default' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default Whiteboard;
