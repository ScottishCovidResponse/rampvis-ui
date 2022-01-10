import { BaseGlyphConfig } from "../types";
import { GlyphScaleConfig } from "../shared/glyphScales";

export interface HeatmapGlyphDataset {
  totalPopulation: number;
}

export interface HeatmapGlyphConfig extends BaseGlyphConfig {
  glyphType: "heatmap";
  scale: GlyphScaleConfig;
}
