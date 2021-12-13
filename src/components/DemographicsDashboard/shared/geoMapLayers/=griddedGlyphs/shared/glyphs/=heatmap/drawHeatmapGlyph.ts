import { DrawGlyph } from "../types";
import { HeatmapGlyphConfig, HeatmapGlyphDataset } from "./types";
import * as d3 from "d3";

const colorScale = d3
  .scaleSequential(d3.interpolateOrRd)
  .domain([0, 1])
  .clamp(true);

export const drawHeatmapGlyph: DrawGlyph<
  HeatmapGlyphDataset,
  HeatmapGlyphConfig
> = ({
  canvasContext,
  glyphConfig: { scale: glyphScale },
  width,
  height,
  x,
  y,
  glyphDataset,
}) => {
  if (glyphScale.scaleType !== "absolute" || !glyphScale.maxScaleValue) {
    return;
  }

  canvasContext.lineWidth = 1;
  canvasContext.beginPath();
  canvasContext.fillStyle = colorScale(
    glyphDataset.totalPopulation / glyphScale.maxScaleValue,
  );
  canvasContext.fillRect(x, y, width, height);
};
