import * as React from "react";
import { GeoBoundary } from "./types";
import { useRouter } from "next/dist/client/router";

const fileLocationInsidePublicFolder =
  "tools/gridded-glyphs/scotland_laulevel1_2011.geojson";

export const useFetchedGeoBoundaries = (): GeoBoundary[] | undefined => {
  const { basePath } = useRouter();
  const [result, setResult] = React.useState<GeoBoundary[] | undefined>();

  React.useEffect(() => {
    fetch(`${basePath}/${fileLocationInsidePublicFolder}`)
      .then((result) => result.json())
      .then((json) => setResult(json.features as GeoBoundary[]));
  }, [basePath]);

  return result;
};
