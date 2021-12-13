export type GlyphScaleType = "absolute" | "relative" | "relativeWithLightness";

export type GlyphScaleConfig =
  | {
      scaleType: "absolute";
      maxScaleValue?: number;
    }
  | {
      scaleType: "relative";
    }
  | {
      scaleType: "relativeWithLightness";
      maxScaleValue?: number;
    };
