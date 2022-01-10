import { BaseGlyphConfig } from "../types";

export interface SimpleShapeGlyphDataset {
  dataPointCount: number;
}

export interface SimpleShapeGlyphConfig extends BaseGlyphConfig {
  glyphType: "simpleShape";
  outlineColor: string;
  outlineRadius: number;
  showDataPointCount: boolean;
}
