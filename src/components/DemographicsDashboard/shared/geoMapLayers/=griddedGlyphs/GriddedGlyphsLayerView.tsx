import * as React from "react";
import { GriddedGlyphsLayerConfig } from "./types";
import { GeoMapLayerView } from "../types";
import { useFetchDemographicDataInHdf5 } from "./useFetchDemographicDataInHdf5";
import {
  extractGlyphMapRecords,
  GlyphMapRecord,
} from "../../../shared/glyphMapRecords";
import { gridTheData } from "./gridTheData";
import { getGlyphBlueprint } from "./shared/glyphs";
import { AbortError } from "../../../shared/AbortError";

const dataPointDisplaySize = 2;

const GriddedGlyphsLayerView: GeoMapLayerView<GriddedGlyphsLayerConfig> = ({
  layerConfig,
  onLayerConfigChange,
  width,
  height,
  geoToScreenX,
  geoToScreenY,
}) => {
  const rawDemographicData = useFetchDemographicDataInHdf5();

  const pixelRatio = window.devicePixelRatio;

  const {
    dataAggregateDistance,
    gridPixelSize,
    glyph: glyphConfig,
    showDataPoints,
    smooth,
  } = layerConfig;

  const yearsPerAgeBin =
    glyphConfig.glyphType === "populationPyramid"
      ? glyphConfig.yearsPerAgeBin
      : 100;

  const [glyphMapRecords, setGlyphMapRecords] = React.useState<
    GlyphMapRecord[]
  >([]);

  React.useEffect(() => {
    setGlyphMapRecords([]);

    if (!rawDemographicData) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    extractGlyphMapRecords(rawDemographicData, {
      aggregateDistance: dataAggregateDistance,
      yearsInAgeBin: yearsPerAgeBin,
      signal,
    })
      .then((glyphMapRecords) => {
        setGlyphMapRecords(glyphMapRecords);
      })
      .catch((error: unknown) => {
        if (!(error instanceof AbortError)) {
          throw error;
        }
      });

    return () => {
      controller.abort();
    };
  }, [dataAggregateDistance, yearsPerAgeBin, rawDemographicData]);

  const griddedData = React.useMemo(
    () =>
      gridTheData(
        glyphMapRecords,
        gridPixelSize,
        width,
        height,
        geoToScreenX,
        geoToScreenY,
        smooth,
      ),
    [
      geoToScreenX,
      geoToScreenY,
      glyphMapRecords,
      gridPixelSize,
      height,
      smooth,
      width,
    ],
  );

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const glyphBlueprint = getGlyphBlueprint(glyphConfig.glyphType);

  const glyphDatasetMatrix = React.useMemo(() => {
    const result: unknown[][] = [];
    griddedData.forEach((recordsInRow, rowIndex) => {
      const rowResult: unknown[] = [];
      recordsInRow.forEach((weightedRecordsInCell, columIndex) => {
        rowResult[columIndex] = glyphBlueprint.aggregateDatasets(
          weightedRecordsInCell,
        );
      });
      result[rowIndex] = rowResult;
    });
    return result;
  }, [glyphBlueprint, griddedData]);

  React.useEffect(() => {
    const amendedGlyphConfig = glyphBlueprint.amendConfig(glyphConfig, {
      reason: "visibleDatasetsChange",
      glyphDatasetMatrix,
    });
    if (amendedGlyphConfig !== glyphConfig) {
      onLayerConfigChange?.({
        ...layerConfig,
        glyph: amendedGlyphConfig,
      });
    }
  }, [
    glyphDatasetMatrix,
    glyphConfig,
    glyphBlueprint,
    onLayerConfigChange,
    layerConfig,
  ]);

  React.useEffect(() => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (!canvasContext) {
      return;
    }
    canvasContext.scale(pixelRatio, pixelRatio);
    canvasContext.clearRect(0, 0, width, height);

    glyphDatasetMatrix.forEach((glyphDatasetsInRow, columnIndex) => {
      glyphDatasetsInRow.forEach((glyphDataset, rowIndex) => {
        try {
          glyphBlueprint.draw({
            glyphDataset,
            x: columnIndex * gridPixelSize,
            y: rowIndex * gridPixelSize,
            width: gridPixelSize,
            height: gridPixelSize,
            canvasContext,
            glyphConfig,
            pixelRatio: pixelRatio,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    if (showDataPoints) {
      canvasContext.strokeStyle = "#0000";
      canvasContext.fillStyle = "#000";
      for (const glyphMapRecord of glyphMapRecords) {
        canvasContext.beginPath();
        canvasContext.rect(
          Math.round(geoToScreenX(glyphMapRecord.x) - dataPointDisplaySize / 2),
          Math.round(geoToScreenY(glyphMapRecord.y) - dataPointDisplaySize / 2),
          dataPointDisplaySize,
          dataPointDisplaySize,
        );
        canvasContext.fill();
      }
    }
    canvasContext?.scale(1 / pixelRatio, 1 / pixelRatio);
  }, [
    height,
    width,
    geoToScreenX,
    geoToScreenY,
    glyphConfig,
    glyphDatasetMatrix,
    glyphBlueprint,
    glyphMapRecords,
    gridPixelSize,
    pixelRatio,
    showDataPoints,
  ]);

  return (
    <>
      <canvas
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          transform: `scale(${1 / pixelRatio})`,
          transformOrigin: "top left",
        }}
        width={Math.floor(width * pixelRatio)}
        height={Math.floor(height * pixelRatio)}
        ref={canvasRef}
      />
    </>
  );
};

export default GriddedGlyphsLayerView;
