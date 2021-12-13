import { GlyphScalePanel } from "../shared/glyphScales";
import { GlyphPanel } from "../types";
import { HeatmapGlyphConfig } from "./types";

const HeatmapGlyphPanel: GlyphPanel<HeatmapGlyphConfig> = ({
  glyphConfig,
  onGlyphConfigChange,
  disabled,
}) => {
  return (
    <>
      <GlyphScalePanel
        acceptedScaleTypes={["absolute"]}
        glyphConfig={glyphConfig}
        onGlyphConfigChange={onGlyphConfigChange}
        disabled={disabled}
      />
    </>
  );
};

export default HeatmapGlyphPanel;
