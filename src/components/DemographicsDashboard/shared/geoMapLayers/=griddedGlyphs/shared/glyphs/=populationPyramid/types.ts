import { GlyphScaleConfig } from "../shared/glyphScales";
import { BaseGlyphConfig } from "../types";

export interface PopulationPyramidGlyphDataset {
  populationBins: number[][]; // gender + age
}

export interface PopulationPyramidGlyphConfig extends BaseGlyphConfig {
  glyphType: "populationPyramid";
  scale: GlyphScaleConfig;
  showGender: boolean;
  yearsPerAgeBin: number;
}
