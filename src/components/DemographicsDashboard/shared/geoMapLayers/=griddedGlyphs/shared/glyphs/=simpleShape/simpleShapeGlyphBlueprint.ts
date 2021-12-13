import { GlyphBlueprint } from "../types";
import { drawSimpleShapeGlyph } from "./drawSimpleShapeGlyph";
import SimpleShapeGlyphPanel from "./SimpleShapeGlyphPanel";
import { SimpleShapeGlyphConfig, SimpleShapeGlyphDataset } from "./types";

export const simpleShapeGlyphBlueprint: GlyphBlueprint<
  SimpleShapeGlyphDataset,
  SimpleShapeGlyphConfig
> = {
  aggregateDatasets: (inputs) => {
    return {
      dataPointCount: inputs.length,
    };
  },
  amendConfig: (glyphConfig) => glyphConfig,
  generateDefaultConfig: () => ({
    glyphType: "simpleShape",
    outlineColor: "#d00",
    outlineRadius: 0,
    showDataPointCount: false,
  }),
  draw: drawSimpleShapeGlyph,
  name: "simple shape (for debugging)",
  Panel: SimpleShapeGlyphPanel,
};
