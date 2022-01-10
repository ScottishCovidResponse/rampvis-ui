import * as React from "react";
import { LinePath } from "@visx/shape";
import { GeoBoundariesViewRenderer } from "./types";

const round = (value: number): number => Math.round(value * 10) / 10;

const GeoBoundariesBasedOnSvg: GeoBoundariesViewRenderer = ({
  width,
  height,
  geoBoundaries,
  geoToScreenX,
  outlineColor,
  geoToScreenY,
}) => {
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      {geoBoundaries.map(({ geometry }, featureIndex) => {
        const multiPolygonCoordinates =
          geometry.type === "MultiPolygon"
            ? geometry.coordinates
            : [geometry.coordinates];

        return multiPolygonCoordinates.map((polygonCoordinates, polygonIndex) =>
          polygonCoordinates.map((outlineCoordinates, outlineIndex) => {
            return (
              <LinePath
                stroke={outlineColor}
                key={featureIndex + "|" + polygonIndex + "|" + outlineIndex}
                data={outlineCoordinates.map(([x, y]) => [
                  round(geoToScreenX(x)),
                  round(geoToScreenY(y)),
                ])}
              />
            );
          }),
        );
      })}
    </svg>
  );
};

export default GeoBoundariesBasedOnSvg;
