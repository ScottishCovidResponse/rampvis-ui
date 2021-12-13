import * as React from "react";
import { GeoBoundariesLayerConfig } from "./types";
import { GeoMapLayerView } from "../types";
import GeoBoundariesBasedOnCanvas from "./GeoBoundariesLayerViewOnCanvas";
import GeoBoundariesBasedOnSvg from "./GeoBoundariesLayerViewOnSvg";
import { useFetchedGeoBoundaries } from "./useFetchedGeoBoundaries";
import * as turf from "@turf/turf";

const GeoBoundariesLayerView: GeoMapLayerView<GeoBoundariesLayerConfig> = ({
  layerConfig,
  ...rest
}) => {
  const geoBoundaries = useFetchedGeoBoundaries();

  const simplifiedGeoBoundaries = React.useMemo(
    () =>
      geoBoundaries?.map((geoBoundary) =>
        turf.simplify(geoBoundary, {
          tolerance: layerConfig.simplificationTolerance,
        }),
      ),
    [geoBoundaries, layerConfig.simplificationTolerance],
  );

  if (!simplifiedGeoBoundaries) {
    return null;
  }

  return layerConfig.renderMethod === "canvas" ? (
    <GeoBoundariesBasedOnCanvas
      geoBoundaries={simplifiedGeoBoundaries}
      outlineColor={layerConfig.outlineColor}
      {...rest}
    />
  ) : (
    <GeoBoundariesBasedOnSvg
      geoBoundaries={simplifiedGeoBoundaries}
      outlineColor={layerConfig.outlineColor}
      {...rest}
    />
  );
};

export default GeoBoundariesLayerView;
