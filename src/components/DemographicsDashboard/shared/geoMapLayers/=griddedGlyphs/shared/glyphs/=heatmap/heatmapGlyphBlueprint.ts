import _ from "lodash";
import { GlyphBlueprint } from "../types";
import { drawHeatmapGlyph } from "./drawHeatmapGlyph";
import HeatmapGlyphPanel from "./HeatmapGlyphPanel";
import { HeatmapGlyphConfig, HeatmapGlyphDataset } from "./types";

export const heatmapGlyphBlueprint: GlyphBlueprint<
  HeatmapGlyphDataset,
  HeatmapGlyphConfig
> = {
  aggregateDatasets: (inputs) => {
    const result: HeatmapGlyphDataset = { totalPopulation: 0 };
    inputs.forEach(([glyphMapRecord, weight]) => {
      result.totalPopulation += _.sum(glyphMapRecord.data.flat(2)) * weight;
    });

    return result;
  },
  amendConfig: (glyphConfig, trigger) => {
    switch (trigger.reason) {
      case "visibleDatasetsChange": {
        if (
          glyphConfig.scale.scaleType === "relative" ||
          glyphConfig.scale.maxScaleValue !== undefined
        ) {
          break;
        }

        let maxScaleValue = 0;
        for (const glyphDatasetsInRow of trigger.glyphDatasetMatrix) {
          for (const glyphDataset of glyphDatasetsInRow) {
            if (!glyphDataset) {
              continue;
            }
            if (glyphDataset.totalPopulation > maxScaleValue) {
              maxScaleValue = glyphDataset.totalPopulation;
            }
          }
        }

        if (maxScaleValue === 0) {
          break;
        }

        return {
          ...glyphConfig,
          scale: {
            ...glyphConfig.scale,
            maxScaleValue,
          },
        };
      }
    }

    return glyphConfig;
  },
  generateDefaultConfig: () => ({
    glyphType: "heatmap",
    scale: { scaleType: "absolute" },
  }),
  draw: drawHeatmapGlyph,
  name: "heatmap",
  Panel: HeatmapGlyphPanel,
};
