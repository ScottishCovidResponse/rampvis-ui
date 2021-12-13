import { Zoom } from "@visx/zoom";
import { GeoExtent } from "./types";
import * as React from "react";
import * as turf from "@turf/turf";
import { scaleLinear } from "@visx/scale";
import { ZoomProps } from "@visx/zoom/lib/Zoom";
import { Button } from "@mui/material";
import { GeoMapConfig } from "./types";
import {
  GeoMapLayerConfig,
  getGeoMapLayerBlueprint,
} from "./shared/geoMapLayers";

export interface GeoMapProps {
  geoMapConfig: GeoMapConfig;
  onGeoMapConfigChange?: (geoMapConfig: GeoMapConfig) => void;
  geoMapScope: turf.BBox;
  width: number;
  height: number;
}

const fitGeoFeaturesIntoRect = (
  bbox: turf.BBox,
  width: number,
  height: number,
): GeoExtent => {
  const bboxRatio = (bbox[2] - bbox[0]) / (bbox[3] - bbox[1]);
  const widthHeightRatio = width / height;

  if (bboxRatio < widthHeightRatio) {
    const delta =
      ((bbox[3] - bbox[1]) * widthHeightRatio - (bbox[2] - bbox[0])) / 2;

    return [
      [bbox[0] - delta, bbox[2] + delta],
      [bbox[1], bbox[3]],
    ];
  } else {
    const delta =
      ((bbox[2] - bbox[0]) / widthHeightRatio - (bbox[3] - bbox[1])) / 2;

    return [
      [bbox[0], bbox[2]],
      [bbox[1] - delta, bbox[3] + delta],
    ];
  }
};

const GeoMapInner: React.VoidFunctionComponent<
  GeoMapProps & { zoom: Parameters<ZoomProps<HTMLDivElement>["children"]>[0] }
> = ({
  zoom,
  width,
  height,
  geoMapScope,
  geoMapConfig,
  onGeoMapConfigChange,
}) => {
  const initialGeoExtent = React.useMemo(
    () => fitGeoFeaturesIntoRect(geoMapScope, width, height),
    [geoMapScope, width, height],
  );

  const scaleX = React.useMemo(
    () =>
      scaleLinear<number>({
        range: [0, width],
        domain: initialGeoExtent[0],
      }),
    [initialGeoExtent, width],
  );

  const geoToScreenX = React.useCallback(
    (geoX: number): number => {
      const coordX = scaleX(geoX);

      return (
        coordX * zoom.transformMatrix.scaleX + zoom.transformMatrix.translateX
      );
    },
    [scaleX, zoom.transformMatrix.scaleX, zoom.transformMatrix.translateX],
  );

  const scaleY = React.useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        domain: initialGeoExtent[1],
      }),
    [height, initialGeoExtent],
  );

  const geoToScreenY = React.useCallback(
    (geoY: number): number => {
      const coordY = scaleY(geoY);

      return (
        coordY * zoom.transformMatrix.scaleY + zoom.transformMatrix.translateY
      );
    },
    [scaleY, zoom.transformMatrix.scaleY, zoom.transformMatrix.translateY],
  );

  return (
    <>
      <div
        ref={zoom.containerRef}
        style={{
          width,
          height,
          cursor: zoom.isDragging ? "grabbing" : "grab",
        }}
        className="wrapper"
      >
        <div
          className="baseLayer"
          onTouchStart={zoom.dragStart}
          onTouchMove={zoom.dragMove}
          onTouchEnd={zoom.dragEnd}
          onMouseDown={zoom.dragStart}
          onMouseMove={zoom.dragMove}
          onMouseUp={zoom.dragEnd}
          onMouseLeave={() => {
            if (zoom.isDragging) zoom.dragEnd();
          }}
        />
        {[...geoMapConfig.layers]
          .reverse()
          .map((layerConfig, layerReverseIndex) => {
            const layerIndex =
              geoMapConfig.layers.length - layerReverseIndex - 1;
            if (!layerConfig.visible) {
              return null;
            }

            const handleLayerConfigChange = (
              newLayerConfig: GeoMapLayerConfig,
            ): void => {
              const newLayerConfigs = [...geoMapConfig.layers];
              newLayerConfigs[layerIndex] = newLayerConfig;
              onGeoMapConfigChange?.({
                ...geoMapConfig,
                layers: newLayerConfigs,
              });
            };

            const geoMapLayerBlueprint = getGeoMapLayerBlueprint(
              layerConfig.geoMapLayerType,
            );
            return (
              <geoMapLayerBlueprint.View
                key={layerIndex}
                layerConfig={layerConfig}
                onLayerConfigChange={handleLayerConfigChange}
                width={width}
                height={height}
                geoToScreenX={geoToScreenX}
                geoToScreenY={geoToScreenY}
              />
            );
          })}
        <div className="controls">
          <Button onClick={zoom.reset}>reset view</Button>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          border-radius: 1em; // FIXME: sync with theme border-radius
          overflow: hidden;
          position: absolute;
          touch-action: none;
        }

        .controls {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .baseLayer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .tempStateReport {
          padding: 10px;
          position: absolute;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

const GeoMap: React.VoidFunctionComponent<GeoMapProps> = (props) => {
  return (
    <Zoom<HTMLDivElement>
      width={props.width}
      height={props.height}
      scaleXMin={1}
      scaleXMax={50}
      scaleYMin={1}
      scaleYMax={50}
    >
      {(zoom) => <GeoMapInner zoom={zoom} {...props} />}
    </Zoom>
  );
};

export default GeoMap;
