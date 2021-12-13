import InfoIcon from "@mui/icons-material/Info";
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
  Tooltip,
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

  const handleGridSizeChange: SliderProps["onChange"] = (event, value) => {
    onLayerConfigChange?.({
      ...layerConfig,
      gridPixelSize: Array.isArray(value) ? value[0] : value,
    });
  };

  const handleSmoothCheckboxChange = () => {
    onLayerConfigChange?.({
      ...layerConfig,
      smooth: !layerConfig.smooth,
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

      if (cappedValue !== layerConfig.gridPixelSize) {
        onLayerConfigChange?.({
          ...layerConfig,
          gridPixelSize: cappedValue,
        });
      }
    };
    return {
      ArrowLeft: (event) => {
        applyGridPixelSize(layerConfig.gridPixelSize - 1);
        event.preventDefault();
      },
      "Shift+ArrowLeft": (event) => {
        applyGridPixelSize(layerConfig.gridPixelSize - 5);
        event.preventDefault();
      },
      ArrowRight: (event) => {
        applyGridPixelSize(layerConfig.gridPixelSize + 1);
        event.preventDefault();
      },
      "Shift+ArrowRight": (event) => {
        applyGridPixelSize(layerConfig.gridPixelSize + 5);
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
      <Divider sx={{ marginTop: 2, marginBottom: 3 }}>Gridding</Divider>

      <FormGroup sx={{ marginTop: 2 }}>
        <FormControl>
          <Typography gutterBottom>
            grid size in pixels: {layerConfig.gridPixelSize}
          </Typography>
          <Slider
            disabled={disabled}
            value={layerConfig.gridPixelSize}
            step={5}
            min={gridPixelSizeSetup.min}
            max={gridPixelSizeSetup.max}
            onChange={handleGridSizeChange}
          />
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={layerConfig.smooth} />}
          onChange={handleSmoothCheckboxChange}
          label={<>smooth </>}
          disabled={disabled}
        />
      </FormGroup>
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
