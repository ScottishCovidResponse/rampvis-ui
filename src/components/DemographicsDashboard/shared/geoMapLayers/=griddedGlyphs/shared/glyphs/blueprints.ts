import { GlyphBlueprint } from "./types";
import { heatmapGlyphBlueprint, HeatmapGlyphConfig } from "./=heatmap";
import {
  populationPyramidGlyphBlueprint,
  PopulationPyramidGlyphConfig,
} from "./=populationPyramid";
import {
  simpleShapeGlyphBlueprint,
  SimpleShapeGlyphConfig,
} from "./=simpleShape";

export type GlyphConfig =
  | HeatmapGlyphConfig
  | PopulationPyramidGlyphConfig
  | SimpleShapeGlyphConfig;

export type GlyphType = GlyphConfig["glyphType"];

export const glyphBlueprintLookup = {
  heatmap: heatmapGlyphBlueprint,
  populationPyramid: populationPyramidGlyphBlueprint,
  simpleShape: simpleShapeGlyphBlueprint,
};

export const getGlyphBlueprint = (GlyphType: GlyphType) => {
  return glyphBlueprintLookup[GlyphType] as GlyphBlueprint<
    unknown,
    GlyphConfig
  >;
};
