import * as React from "react";
import { GeoBoundariesViewRenderer } from "./types";

const GeoBoundariesBasedOnCanvas: GeoBoundariesViewRenderer = ({
  width,
  height,
  geoBoundaries,
  outlineColor,
  geoToScreenX,
  geoToScreenY,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (!canvasContext) {
      return;
    }

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.strokeStyle = outlineColor;

    for (const geoBoundary of geoBoundaries) {
      const coordinates =
        geoBoundary.geometry.type === "Polygon"
          ? [geoBoundary.geometry.coordinates]
          : geoBoundary.geometry.coordinates;

      for (const part of coordinates) {
        canvasContext.beginPath();
        for (const ring of part) {
          for (const coord of ring) {
            canvasContext.lineTo(
              geoToScreenX(coord[0]),
              geoToScreenY(coord[1]),
            );
          }
          canvasContext.stroke();
        }
      }
    }
  }, [geoToScreenX, geoToScreenY, height, outlineColor, geoBoundaries, width]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      style={{ position: "absolute" }}
    />
  );
};

export default GeoBoundariesBasedOnCanvas;
