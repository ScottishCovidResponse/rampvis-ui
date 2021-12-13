import _ from "lodash";
import { DrawGlyph } from "../types";
import {
  PopulationPyramidGlyphConfig,
  PopulationPyramidGlyphDataset,
} from "./types";

export const drawPopulationPyramidGlyph: DrawGlyph<
  PopulationPyramidGlyphDataset,
  PopulationPyramidGlyphConfig
> = ({
  canvasContext,
  glyphConfig: { yearsPerAgeBin, showGender, scale: scaleConfig },
  width,
  height,
  x,
  y,
  glyphDataset,
}) => {
  const maxValueInGlyphDataset = Math.max(
    ...glyphDataset.populationBins.flat(),
  );

  if (!maxValueInGlyphDataset) {
    return;
  }

  const populationOfBiggestBar =
    scaleConfig.scaleType === "absolute"
      ? scaleConfig.maxScaleValue
      : maxValueInGlyphDataset;

  const globalAlpha =
    scaleConfig.scaleType === "relativeWithLightness"
      ? typeof scaleConfig.maxScaleValue === "number"
        ? _.sum(glyphDataset.populationBins.flat()) / scaleConfig.maxScaleValue
        : undefined
      : 1;

  if (!populationOfBiggestBar || !globalAlpha) {
    return;
  }

  for (let ageIdx = 0; ageIdx < glyphDataset.populationBins.length; ageIdx++) {
    for (
      let genderIdx = 0;
      genderIdx < glyphDataset.populationBins[ageIdx].length;
      genderIdx++
    ) {
      const hBar = height / glyphDataset.populationBins.length;
      let wBar =
        ((glyphDataset.populationBins[ageIdx][genderIdx] /
          populationOfBiggestBar) *
          width) /
        2;
      if (genderIdx == 0) {
        wBar = -wBar;
      }
      canvasContext.beginPath();
      if (showGender)
        if (genderIdx == 0) canvasContext.fillStyle = "#fbb";
        else canvasContext.fillStyle = "#bbf";
      else canvasContext.fillStyle = "#bbb";

      const originalGlobalAlpha = canvasContext.globalAlpha;
      canvasContext.globalAlpha = globalAlpha;
      canvasContext.fillRect(x + width / 2, y + ageIdx * hBar, wBar, hBar);
      canvasContext.globalAlpha = originalGlobalAlpha;
    }
  }
};
