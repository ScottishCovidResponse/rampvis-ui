import { DrawGlyph } from "../types";
import { SimpleShapeGlyphConfig, SimpleShapeGlyphDataset } from "./types";
import { roundRect } from "./roundRect";

export const drawSimpleShapeGlyph: DrawGlyph<
  SimpleShapeGlyphDataset,
  SimpleShapeGlyphConfig
> = ({
  canvasContext,
  glyphConfig: { outlineColor, outlineRadius, showDataPointCount },
  width,
  height,
  x,
  y,
  glyphDataset,
  pixelRatio,
}) => {
  const lineWidth = pixelRatio / 2;
  canvasContext.beginPath();
  canvasContext.strokeStyle = outlineColor;
  canvasContext.lineWidth = lineWidth;

  roundRect.apply(canvasContext, [
    x + lineWidth,
    y + lineWidth,
    width,
    height,
    [outlineRadius],
  ]);
  // TODO: Replaces with a method when available:
  // canvasContext.roundRect(...);

  canvasContext.stroke();

  const dataPointCountToShow = showDataPointCount
    ? glyphDataset.dataPointCount
    : 0;

  const fontSize = 10;
  if (dataPointCountToShow > 0) {
    canvasContext.fillStyle = outlineColor;
    canvasContext.font = `${fontSize}px Arial`;
    canvasContext.textAlign = "center";
    canvasContext.fillText(
      `${dataPointCountToShow}`,
      x + width / 2,
      y + height / 2 + fontSize * 0.4,
    );
  }
};
