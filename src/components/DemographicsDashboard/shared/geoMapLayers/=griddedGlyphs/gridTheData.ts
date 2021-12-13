import { GlyphMapRecord } from "../../glyphMapRecords";

export const gridTheData = (
  glyphMapRecords: GlyphMapRecord[],
  gridPixelSize: number,
  width: number,
  height: number,
  geoToScreenX: (geoX: number) => number,
  geoToScreenY: (geoY: number) => number,
  smooth: boolean,
): [GlyphMapRecord, number][][][] => {
  if (smooth) {
    gridPixelSize /= 2;
  }
  //create a grid
  const grid: [GlyphMapRecord, number][][][] = [];
  for (let col = 0; col < Math.ceil(width / gridPixelSize); col++)
    grid.push(new Array(Math.ceil(height / gridPixelSize)));

  for (const glyphMapRecord of glyphMapRecords) {
    const col = Math.floor(geoToScreenX(glyphMapRecord.x) / gridPixelSize);
    const row = Math.floor(geoToScreenY(glyphMapRecord.y) / gridPixelSize);
    if (col >= 0 && col < grid.length && row >= 0 && row < grid[0].length) {
      let records: [GlyphMapRecord, number][] = grid[col][row];
      if (records === undefined) {
        records = [];
        grid[col][row] = records;
      }
      if (grid[col][row] != undefined) grid[col][row].push([glyphMapRecord, 1]);
    }
  }
  return grid;
};
