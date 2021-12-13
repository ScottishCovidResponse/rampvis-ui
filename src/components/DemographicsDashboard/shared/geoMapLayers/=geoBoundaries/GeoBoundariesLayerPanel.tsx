import {
  FormControl,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  SliderProps,
} from "@mui/material";
import * as React from "react";
import { GeoBoundariesLayerConfig, RenderMethod } from "./types";
import { GeoMapLayerPanel } from "../types";
import GeoMapLayerPanelEssentials from "../shared/GeoMapLayerPanelEssentials";
import { HexColorPicker } from "react-colorful";
import useClickOutside from "./useClickOutside";

const ticks = [0, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

const convertTo125Tick = (n: number) => ticks.indexOf(n) ?? 0;
const convertFrom125Tick = (n: number) => ticks[n] ?? 0;

const GeoBoundariesLayerPanel: GeoMapLayerPanel<GeoBoundariesLayerConfig> = ({
  layerConfig,
  onLayerConfigChange,
}) => {
  const handleRenderMethodChange = (event: unknown, value: RenderMethod) => {
    onLayerConfigChange?.({ ...layerConfig, renderMethod: value });
  };

  const handleOutlineColorChange = (value: string) => {
    onLayerConfigChange?.({ ...layerConfig, outlineColor: value });
  };

  const handleSimplificationToleranceChange: SliderProps["onChange"] = (
    event,
    value,
  ) => {
    onLayerConfigChange?.({
      ...layerConfig,
      simplificationTolerance: Array.isArray(value)
        ? 0
        : convertFrom125Tick(value),
    });
  };

  const popover = React.useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = React.useState(false);

  const close = React.useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  const handleOutlineColorSwatchClick = () => {
    if (layerConfig.visible) {
      toggle(true);
    }
  };

  return (
    <GeoMapLayerPanelEssentials
      header="Geo boundaries"
      layerConfig={layerConfig}
      onLayerConfigChange={onLayerConfigChange}
    >
      <ToggleButtonGroup
        disabled={!layerConfig.visible}
        color={layerConfig.visible ? "primary" : undefined}
        size="small"
        value={layerConfig.renderMethod}
        exclusive
        onChange={handleRenderMethodChange}
      >
        <ToggleButton value="canvas">canvas</ToggleButton>
        <ToggleButton value="svg">SVG</ToggleButton>
      </ToggleButtonGroup>

      <div className="picker">
        <div
          className="swatch"
          style={{
            backgroundColor: layerConfig.visible
              ? layerConfig.outlineColor
              : "#bbb",
          }}
          onClick={handleOutlineColorSwatchClick}
        />
        {isOpen && (
          <div className="popover" ref={popover}>
            <HexColorPicker
              color={layerConfig.outlineColor}
              onChange={handleOutlineColorChange}
            />
          </div>
        )}
      </div>

      <FormControl fullWidth sx={{ paddingTop: 2 }}>
        <Typography>
          simplification tolerance: {layerConfig.simplificationTolerance}
        </Typography>
        <Slider
          disabled={!layerConfig.visible}
          value={convertTo125Tick(layerConfig.simplificationTolerance)}
          step={1}
          min={0}
          max={ticks.length - 1}
          onChange={handleSimplificationToleranceChange}
        />
      </FormControl>

      <style jsx>{`
        .picker {
          position: absolute;
          right: 0px;
          top: 40px;
        }
        .swatch {
          position: absolute;
          right: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 3px solid #fff;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .popover {
          z-index: 100;
          position: absolute;
          top: calc(100% + 40px);
          right: 0;
          border-radius: 9px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </GeoMapLayerPanelEssentials>
  );
};

export default GeoBoundariesLayerPanel;
