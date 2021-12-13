import { GlyphMapRecord } from "./types";

import { eastingNorthingByOsgbTileKey } from "./eastingNorthingByOsgbTileKey";
import { VirtualHdf5File } from "./types";
import sleep from "sleep-promise";
import { AbortError } from "../AbortError";
import LRU from "lru-cache";

interface ExtractGlyphMapRecordsOptions {
  aggregateDistance?: number;
  yearsInAgeBin?: number;
  signal?: AbortSignal;
}

type ExtractGlyphMapRecords = (
  virtualHdf5File: VirtualHdf5File,
  options?: ExtractGlyphMapRecordsOptions,
) => Promise<GlyphMapRecord[]>;

export const doExtractGlyphMapRecords: ExtractGlyphMapRecords = async (
  virtualHdf5File,
  { aggregateDistance = 1000, yearsInAgeBin = 10, signal } = {},
) => {
  const glyphMapRecordLookup: { [key: string]: GlyphMapRecord } = {};

  let aborted = false;
  signal?.addEventListener("abort", () => {
    aborted = true;
  });

  const throwIfAbortedOrSleep = async (): Promise<void> => {
    if (aborted) {
      throw new AbortError();
    }
    await sleep(50);
  };

  const locations = virtualHdf5File.get<string[]>(
    "grid area/age/genders/Dimension_1_names",
  ).value;

  await throwIfAbortedOrSleep();

  const ages = virtualHdf5File.get<number[]>(
    "grid area/age/genders/Dimension_2_names",
  ).value;

  await throwIfAbortedOrSleep();

  const genders = virtualHdf5File.get<number[]>(
    "grid area/age/genders/Dimension_3_names",
  ).value;

  await throwIfAbortedOrSleep();

  //let data = virtualHdf5File.get<number[]>("grid area/age/persons/array").value;
  const data = virtualHdf5File.get<number[]>(
    "grid area/age/genders/array",
  ).value;

  await throwIfAbortedOrSleep();

  for (let locationIdx = 0; locationIdx < locations.length; locationIdx++) {
    if (locationIdx % 20000 === 0) {
      await throwIfAbortedOrSleep();
    }

    const gridRef: string = locations[locationIdx];
    const [eastingPrefix, northingPrefix] = eastingNorthingByOsgbTileKey[
      gridRef.toUpperCase().substring(0, 2)
    ] ?? [0, 0];
    const partialEasting: string = gridRef.substring(2, 4);
    const partialNorthing = gridRef.substring(4, 6);
    const easting = `${eastingPrefix}${partialEasting}000`;
    const northing = `${northingPrefix}${partialNorthing}000`;
    const x: number =
      Math.trunc(parseInt(easting) / aggregateDistance) * aggregateDistance +
      aggregateDistance / 2;
    const y: number =
      Math.trunc(parseInt(northing) / aggregateDistance) * aggregateDistance +
      aggregateDistance / 2;
    const gridKey: string = x + "-" + y;
    let record: GlyphMapRecord = glyphMapRecordLookup[gridKey];
    if (record == undefined) {
      const emptyArray = new Array(100 / yearsInAgeBin).fill(0);
      for (let i = 0; i < emptyArray.length; i++)
        emptyArray[i] = new Array(2).fill(0);

      record = { x: x, y: y, data: emptyArray };

      glyphMapRecordLookup[gridKey] = record;
    }
    //aggregate into age band
    for (let ageIdx = 0; ageIdx < ages.length; ageIdx++) {
      const ageBand = Math.trunc(ageIdx / yearsInAgeBin);
      //let v: number = data[ageIdx * locations.length + locationIdx];
      for (let genderIdx = 0; genderIdx < genders.length; genderIdx++) {
        const v: number =
          data[
            ageIdx * locations.length +
              genderIdx * ages.length * locations.length +
              locationIdx
          ];
        record.data[ageBand][genderIdx] += v;
      }
    }
  }

  return Object.values(glyphMapRecordLookup);
};

const lruCache = new LRU<string, GlyphMapRecord[] | "loading">({
  max: 10,
  maxAge: 1000 * 60 * 60,
});
let virtualHdf5FileInCache: VirtualHdf5File | undefined = undefined;
let warned = false;

export const extractGlyphMapRecords: ExtractGlyphMapRecords = async (
  virtualHdf5File,
  { aggregateDistance = 1000, yearsInAgeBin = 10, signal } = {},
) => {
  if (!virtualHdf5FileInCache) {
    virtualHdf5FileInCache = virtualHdf5File;
  } else if (virtualHdf5File !== virtualHdf5FileInCache) {
    if (!warned) {
      console.warn(
        "Current implementation of extractGlyphMapRecords does not support changes in virtualHdf5File. Please update the implementation or comment out this warning.",
      );
      warned = true;
    }
    return doExtractGlyphMapRecords(virtualHdf5File, {
      aggregateDistance,
      yearsInAgeBin,
      signal,
    });
  }

  const cacheKey = `${aggregateDistance} | ${yearsInAgeBin}`;

  while (lruCache.get(cacheKey) === "loading") {
    sleep(50);
  }

  const cacheValue = lruCache.get(cacheKey);
  if (typeof cacheValue === "object") {
    return cacheValue;
  }

  signal?.addEventListener("abort", () => {
    if (lruCache.get(cacheKey) === "loading") {
      lruCache.del(cacheKey);
    }
  });

  lruCache.set(cacheKey, "loading");

  const result = await doExtractGlyphMapRecords(virtualHdf5File, {
    aggregateDistance,
    yearsInAgeBin,
    signal,
  });

  lruCache.set(cacheKey, result);
  return result;
};
