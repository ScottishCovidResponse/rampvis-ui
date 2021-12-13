import * as React from "react";
import * as hdf5 from "h5wasm";
import { useRouter } from "next/dist/client/router";
import sleep from "sleep-promise";
import { VirtualHdf5File } from "../../glyphMapRecords";

const fileLocationInsidePublicFolder =
  "tools/gridded-glyphs/d298197ad0b8e2cc54836908da511de7fe1c9877.h5";

let globallyCachedValue: VirtualHdf5File | undefined = undefined;

export const useFetchDemographicDataInHdf5 = ():
  | VirtualHdf5File
  | undefined => {
  const { basePath } = useRouter();
  const [result, setResult] = React.useState<VirtualHdf5File | undefined>(
    globallyCachedValue,
  );

  React.useEffect(() => {
    if (result) {
      return;
    }

    fetch(`${basePath}/${fileLocationInsidePublicFolder}`).then(
      async (result) => {
        const arrayBuffer = await result.arrayBuffer();

        // For some reason hdf5.FS is equal to null on app load.
        // Waiting for it to become available avoids crashes.
        while (!hdf5.FS) {
          sleep(100);
        }

        const virtualFilePath = "my-virtual-file";
        hdf5.FS.writeFile(virtualFilePath, new Uint8Array(arrayBuffer));
        const f = new hdf5.File(virtualFilePath, "r");
        globallyCachedValue = f;
        setResult(f);
      },
    );
  }, [basePath, result]);

  return result;
};
