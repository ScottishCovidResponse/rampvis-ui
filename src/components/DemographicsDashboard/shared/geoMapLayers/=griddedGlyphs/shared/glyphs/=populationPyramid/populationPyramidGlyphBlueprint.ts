import { GlyphBlueprint } from "../types";
import { drawPopulationPyramidGlyph } from "./drawPopulationPyramidGlyph";
import {
  PopulationPyramidGlyphConfig,
  PopulationPyramidGlyphDataset,
} from "./types";
import PopulationPyramidGlyphPanel from "./PopulationPyramidGlyphPanel";

export const populationPyramidGlyphBlueprint: GlyphBlueprint<
  PopulationPyramidGlyphDataset,
  PopulationPyramidGlyphConfig
> = {
  aggregateDatasets: (inputs) => {
    const result: PopulationPyramidGlyphDataset = { populationBins: [] };
    inputs.forEach(([glyphMapRecord, weight], index) => {
      for (let index1 = 0; index1 < glyphMapRecord.data.length; index1 += 1) {
        if (result.populationBins[index1] === undefined) {
          result.populationBins[index1] = [];
        }
        for (
          let index2 = 0;
          index2 < glyphMapRecord.data[index1].length;
          index2 += 1
        ) {
          if (result.populationBins[index1][index2] === undefined) {
            result.populationBins[index1][index2] = 0;
          }
          result.populationBins[index1][index2] +=
            glyphMapRecord.data[index1]?.[index2] ?? 0;
        }
      }
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
            let maxValueInGlyphDataset = 0;
            for (const values of glyphDataset.populationBins) {
              for (const value of values) {
                if (glyphConfig.scale.scaleType == "absolute") {
                  if (value > maxValueInGlyphDataset) {
                    maxValueInGlyphDataset = value;
                  }
                } else {
                  maxValueInGlyphDataset += value;
                }
              }
            }
            if (maxValueInGlyphDataset > maxScaleValue) {
              maxScaleValue = maxValueInGlyphDataset;
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
    glyphType: "populationPyramid",
    scale: { scaleType: "absolute" },
    yearsPerAgeBin: 10,
    showGender: false,
  }),
  draw: drawPopulationPyramidGlyph,
  name: "population pyramid",
  Panel: PopulationPyramidGlyphPanel,
};
