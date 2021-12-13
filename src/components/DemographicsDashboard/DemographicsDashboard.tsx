import { GeoMapConfig } from "./types";
import * as React from "react";
import GeoMap from "./GeoMap";
import { Button, Container, Paper } from "@mui/material";
import useSize from "@react-hook/size";
import { Box } from "@mui/system";
import {
  geoMapLayerBlueprintLookup,
  getGeoMapLayerBlueprint,
} from "./shared/geoMapLayers";
import * as turf from "@turf/turf";

// Scotland in OSGB
const geoMapScope: turf.BBox = [7565, 530894, 467680, 1218619];

export const defaultGeoMapConfig: GeoMapConfig = {
  layers: [
    geoMapLayerBlueprintLookup.geoBoundaries.generateDefaultConfig(),
    geoMapLayerBlueprintLookup.griddedGlyphs.generateDefaultConfig(),
  ],
};

const DemographicsDashboard: React.VoidFunctionComponent = () => {
  const [geoMapConfig, setGeoMapConfig] =
    React.useState<GeoMapConfig>(defaultGeoMapConfig);

  const handleResetLayersClick = () => {
    setGeoMapConfig({
      ...geoMapConfig,
      layers: defaultGeoMapConfig.layers,
    });
  };

  const geoMapContainerRef = React.useRef(null);
  const [geoMapContainerWidth, geoMapContainerHeight] =
    useSize(geoMapContainerRef);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="row"
      sx={{ boxSizing: "border-box" }}
    >
      <Container
        sx={{
          paddingTop: 2,
          paddingLeft: 2,
          paddingRight: 2,
          marginRight: 1,
          flex: 0,
          width: 300,
          minWidth: 300,
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
        }}
        disableGutters={true}
      >
        {geoMapConfig.layers.map((layerConfig, layerIndex) => {
          const geoMapLayerBlueprint = getGeoMapLayerBlueprint(
            layerConfig.geoMapLayerType,
          );
          return (
            <Paper
              key={layerIndex}
              sx={{
                padding: 2,
                paddingTop: 0,
                marginBottom: 2,
                background: "#f0f4f4",
                flex: 0,
              }}
            >
              <geoMapLayerBlueprint.Panel
                layerConfig={layerConfig}
                onLayerConfigChange={(newLayerConfig) => {
                  const newLayerConfigs = [...geoMapConfig.layers];
                  newLayerConfigs.splice(layerIndex, 1, newLayerConfig);
                  setGeoMapConfig(() => ({
                    ...geoMapConfig,
                    layers: newLayerConfigs,
                  }));
                }}
              />
            </Paper>
          );
        })}
        <Button
          fullWidth
          sx={{ marginBottom: 2 }}
          onClick={handleResetLayersClick}
          disabled={
            JSON.stringify(geoMapConfig.layers) ===
            JSON.stringify(defaultGeoMapConfig.layers)
          }
        >
          reset layers
        </Button>
      </Container>
      <Paper
        sx={{ margin: 2, marginLeft: 0, flex: 1, background: "#f0f4f4" }}
        ref={geoMapContainerRef}
      >
        {geoMapContainerWidth && geoMapContainerHeight ? (
          <GeoMap
            geoMapScope={geoMapScope}
            geoMapConfig={geoMapConfig}
            onGeoMapConfigChange={setGeoMapConfig}
            width={geoMapContainerWidth}
            height={geoMapContainerHeight}
          />
        ) : null}
      </Paper>
    </Box>
  );
};

export default DemographicsDashboard;
