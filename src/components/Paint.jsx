import React, { useEffect, useState } from "react";

export const Paint = () => {
  const columns = 100;
  const [cellSize, setCellSize] = useState(0);
  const [rows, setRows] = useState(0);
  const [color, setColor] = useState("#000");
  const [cellColor, setCellColor] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const colors = ["#000", "#d40a0a", "#0e12f5", "#75e40d", "#ec0ca9"];
  const [selectCell, setSellectCell] = useState(null);
  const [pickPosition, setPickPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const calculateGrid = () => {
    const newCellSize = Math.floor(window.innerWidth / columns);
    const newRows = Math.floor(window.innerHeight / newCellSize);
    setCellSize(newCellSize);
    setRows(newRows);
  };
  useEffect(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  const handleSelectCellColor = (index) => {
    setIsDrawing(true);
    setCellColor((prev) => {
      const isPainted = prev[index];
      return { ...prev, [index]: isPainted ? undefined : color };
    });
  };

  const handleOnMouseMove = (index) => {
    if (isDrawing) {
      setCellColor((prev) => ({ ...prev, [index]: color }));
    }
  };

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener("mouseup", stopDrawing);
    return () => window.removeEventListener("mouseup", stopDrawing);
  }, []);

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setPickPosition({ x: e.clientX, y: e.clientY });
    setSellectCell(index);
    setShowMenu(true);
  };

  const handleOnClick = (color) => {
    setColor(color);
    setCellColor((prev) => ({ ...prev, [selectCell]: color }));
    setShowMenu(false);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      <div
        className="grid w-full h-screen"
        style={{ gridTemplateColumns: `repeat(${columns}, ${cellSize}px)` }}
      >
        {Array.from({ length: columns * rows }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-300 box-border"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              background: cellColor[index || "white"],
            }}
            onMouseDown={() => handleSelectCellColor(index)}
            onMouseMove={() => handleOnMouseMove(index)}
            onContextMenu={(e) => handleContextMenu(e, index)}
          ></div>
        ))}
      </div>
      {showMenu && (
        <div
          className="absolute z-50 bg-white shadow shadow-gray-500 p-2"
          style={{ top: pickPosition.y, left: pickPosition.x }}
          onMouseLeave={handleCloseMenu}
        >
          <p>Elegi un color:</p>
          <div className="flex gap-2">
            {colors.map((e, i) => (
              <div
                key={i}
                style={{ backgroundColor: e }}
                className="w-5 h-5"
                onClick={() => handleOnClick(e)}
              ></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
