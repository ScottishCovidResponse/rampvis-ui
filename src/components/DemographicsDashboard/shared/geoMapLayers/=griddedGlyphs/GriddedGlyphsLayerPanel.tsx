import GeoMapLayerPanelEssentials from "../shared/GeoMapLayerPanelEssentials";
import { GeoMapLayerPanel } from "../types";
import * as React from "react";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Slider,
  SliderProps,
  Typography,
} from "@mui/material";
import { GriddedGlyphsLayerConfig } from "./types";
import GlyphPanel from "./shared/glyphs/GlyphPanel";
import { GlyphConfig } from "./shared/glyphs";
import { useHotkeys } from "./shared/useHotkeys";
import { KeyBindingMap } from "tinykeys";
import {
  aggregateDistanceSetup,
  gridPixelSizeSetup,
} from "./shared/helpersForConfig";
import { GridConfig } from "./shared/grid/blueprints";
import GridPanel from "./shared/grid/GridPanel";

const GriddedGlyphsLayerPanel: GeoMapLayerPanel<GriddedGlyphsLayerConfig> = ({
  layerConfig,
  onLayerConfigChange,
}) => {
  const disabled = !layerConfig.visible;
  const handleAggregateDistanceChange: SliderProps["onChange"] = (
    event,
    value,
  ) => {
    onLayerConfigChange?.({
      ...layerConfig,
      dataAggregateDistance:
        aggregateDistanceSetup.acceptedValues[
          Array.isArray(value) ? value[0] : value
        ],
    });
  };

  const handleShowDataPointsCheckboxChange = () => {
    onLayerConfigChange?.({
      ...layerConfig,
      showDataPoints: !layerConfig.showDataPoints,
    });
  };

  const handleShowGridChange = () => {
    onLayerConfigChange?.({
      ...layerConfig,
      showGridOutline: !layerConfig.showGridOutline,
    });
  };

  const handleGridConfigChange = (gridConfig: GridConfig) => {
    onLayerConfigChange?.({
      ...layerConfig,
      grid: gridConfig,
    });
  };

  const handleGlyphConfigChange = (glyphConfig: GlyphConfig) => {
    onLayerConfigChange?.({
      ...layerConfig,
      glyph: glyphConfig,
    });
  };

  const keyBindingMap = React.useMemo<KeyBindingMap>(() => {
    if (disabled) {
      return {} as KeyBindingMap;
    }

    const applyGridPixelSize = (newValue: number) => {
      const cappedValue = Math.min(
        gridPixelSizeSetup.max,
        Math.max(gridPixelSizeSetup.min, newValue),
      );

      if (cappedValue !== layerConfig.grid.pixelSize) {
        onLayerConfigChange?.({
          ...layerConfig,
          grid: {
            ...layerConfig.grid,
            pixelSize: cappedValue,
          },
        });
      }
    };
    return {
      ArrowLeft: (event) => {
        applyGridPixelSize(layerConfig.grid.pixelSize - 1);
        event.preventDefault();
      },
      "Shift+ArrowLeft": (event) => {
        applyGridPixelSize(layerConfig.grid.pixelSize - 5);
        event.preventDefault();
      },
      ArrowRight: (event) => {
        applyGridPixelSize(layerConfig.grid.pixelSize + 1);
        event.preventDefault();
      },
      "Shift+ArrowRight": (event) => {
        applyGridPixelSize(layerConfig.grid.pixelSize + 5);
        event.preventDefault();
      },
      g: (event) => {
        applyGridPixelSize(gridPixelSizeSetup.default);
        event.preventDefault();
      },
    };
  }, [disabled, layerConfig, onLayerConfigChange]);
  useHotkeys(keyBindingMap);

  return (
    <GeoMapLayerPanelEssentials
      header="Gridded glyphs"
      layerConfig={layerConfig}
      onLayerConfigChange={onLayerConfigChange}
    >
      <FormGroup>
        <FormControl>
          <Typography gutterBottom>
            aggregate distance in km: {layerConfig.dataAggregateDistance / 1000}
          </Typography>
          <Slider
            disabled={disabled}
            value={aggregateDistanceSetup.acceptedValues.indexOf(
              layerConfig.dataAggregateDistance,
            )}
            step={null}
            min={0}
            max={aggregateDistanceSetup.acceptedValues.length - 1}
            marks={aggregateDistanceSetup.acceptedValues.map(
              (value, index) => ({
                value: index,
              }),
            )}
            onChange={handleAggregateDistanceChange}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={layerConfig.showDataPoints}
              disabled={disabled}
            />
          }
          onChange={handleShowDataPointsCheckboxChange}
          label="show data points"
        />
      </FormGroup>
      <Divider sx={{ marginTop: 2, marginBottom: 1 }}>Gridding</Divider>
      <FormControlLabel
        sx={{ marginBottom: 2 }}
        control={
          <Checkbox checked={layerConfig.showGridOutline} disabled={disabled} />
        }
        onChange={handleShowGridChange}
        label="show grid outline"
      />
      <GridPanel
        disabled={disabled}
        gridConfig={layerConfig.grid}
        onGridConfigChange={handleGridConfigChange}
      />

      <Divider sx={{ marginTop: 3, marginBottom: 2 }}>Glyph</Divider>
      <GlyphPanel
        disabled={disabled}
        glyphConfig={layerConfig.glyph}
        onGlyphConfigChange={handleGlyphConfigChange}
      />
    </GeoMapLayerPanelEssentials>
  );
};

export default GriddedGlyphsLayerPanel;
