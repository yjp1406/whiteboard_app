import { useState, useEffect , useLayoutEffect, use} from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements , tool}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth*2;
    canvas.height = window.innerHeight/2;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;   
  }, []);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    if(elements.length>0){
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    elements.forEach((element) => {
        if(element.type === "pencil") {
        roughCanvas.linearPath(element.path);
        }else if(element.type === "line") {
        roughCanvas.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height));
        } else if(element.type === "rect") {
        roughCanvas.draw(roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height));
        }
    });
  },[elements]);

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
        
        if(tool === "pencil") {
            const {path} = elements[elements.length - 1];
            const newPath = [...path, [offsetX, offsetY]];
            setElements((prevElements) => 
                prevElements.map((ele,index) => {
                    if (index === elements.length - 1) {
                        return {
                            ...ele,
                            path: newPath,
                        }
                    }
                    return ele;
                })
            );
        }else if(tool === "line") {
            setElements((prevElements) => 
                prevElements.map((ele,index) => {
                    if (index === elements.length - 1) {
                        return {
                            ...ele,
                            width:offsetX,
                            height:offsetY,
                    
                            // path: newPath,
                        }
                    }
                    return ele;
                })
            );
        } else if(tool === "rect") {
            setElements((prevElements) => 
                prevElements.map((ele,index) => {
                    if (index === elements.length - 1) {
                        return {
                            ...ele,
                            width:offsetX - ele.offsetX,
                            height:offsetY - ele.offsetY,
                        }
                    }
                    return ele;
                })
            );
        }

    }
  };
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if(tool === "pencil") {
        setElements((prevElements) => [
          ...prevElements,
          {
            type: "pencil", // You can change this based on the selected tool
            offsetX,
            offsetY,
            path: [[offsetX, offsetY]], // Store the path as an array of points
            stroke: "black", // You can change this to use a color state
          },
        ]);
    }   else if(tool === "line") {
        setElements((prevElements) => [
          ...prevElements,
          {
            type: "line", // You can change this based on the selected tool
            offsetX,
            offsetY,
            width: offsetX, // Initial width and height will be updated on mouse move
            height: offsetY,
            stroke: "black", // You can change this to use a color state    
        },]);
    }
    else if(tool === "rect") {
        setElements((prevElements) => [
          ...prevElements,
          {
            type: "rect", // You can change this based on the selected tool
            offsetX,
            offsetY,
            width: 0, // Initial width and height will be updated on mouse move
            height: 0,
            stroke: "black", // You can change this to use a color state    
        },]);
    }


    setIsDrawing(true);
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
        className="border border-dark border-3 h-100 w-100 overflow-hidden">
            <canvas
              ref={canvasRef}
            />
    </div>
  );
};

export default Whiteboard;
