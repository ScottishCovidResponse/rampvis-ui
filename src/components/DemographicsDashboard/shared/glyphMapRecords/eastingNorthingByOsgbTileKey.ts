// Copied from https://support.landmark.co.uk/hc/en-gb/articles/206913765-National-Grid-Reference-Coordinate-Conversion

export const eastingNorthingByOsgbTileKey: Record<
  string,
  [eastingPrefix: number, northingPrefix: number]
> = {
  HL: [0, 12],
  HM: [1, 12],
  HN: [2, 12],
  HO: [3, 12],
  HP: [4, 12],
  HQ: [0, 11],
  HR: [1, 11],
  HS: [2, 11],
  HT: [3, 11],
  HU: [4, 11],
  HV: [0, 10],
  HW: [1, 10],
  HX: [2, 10],
  HY: [3, 10],
  HZ: [4, 10],
  JL: [5, 12],
  JM: [6, 12],
  JN: [7, 12],
  JQ: [5, 11],
  JR: [6, 11],
  JS: [7, 11],
  JV: [5, 10],
  JW: [6, 10],
  JX: [7, 10],
  NA: [0, 9],
  NB: [1, 9],
  NC: [2, 9],
  ND: [3, 9],
  NE: [4, 9],
  NF: [0, 8],
  NG: [1, 8],
  NH: [2, 8],
  NJ: [3, 8],
  NK: [4, 8],
  NL: [0, 7],
  NM: [1, 7],
  NN: [2, 7],
  NO: [3, 7],
  NP: [4, 7],
  NQ: [0, 6],
  NR: [1, 6],
  NS: [2, 6],
  NT: [3, 6],
  NU: [4, 6],
  NV: [0, 5],
  NW: [1, 5],
  NX: [2, 5],
  NY: [3, 5],
  NZ: [4, 5],
  OA: [5, 9],
  OB: [6, 9],
  OC: [7, 9],
  OF: [5, 8],
  OG: [6, 8],
  OH: [7, 8],
  OL: [5, 7],
  OM: [6, 7],
  ON: [7, 7],
  OQ: [5, 6],
  OR: [6, 6],
  OS: [7, 6],
  OV: [5, 5],
  OW: [6, 5],
  OX: [7, 5],
  SA: [0, 4],
  SB: [1, 4],
  SC: [2, 4],
  SD: [3, 4],
  SE: [4, 4],
  SF: [0, 3],
  SG: [1, 3],
  SH: [2, 3],
  SJ: [3, 3],
  SK: [4, 3],
  SL: [0, 2],
  SM: [1, 2],
  SN: [2, 2],
  SO: [3, 2],
  SP: [4, 2],
  SQ: [0, 1],
  SR: [1, 1],
  SS: [2, 1],
  ST: [3, 1],
  SU: [4, 1],
  SV: [0, 0],
  SW: [1, 0],
  SX: [2, 0],
  SY: [3, 0],
  SZ: [4, 0],
  TA: [5, 4],
  TB: [6, 4],
  TC: [7, 4],
  TF: [5, 3],
  TG: [6, 3],
  TH: [7, 3],
  TL: [5, 2],
  TM: [6, 2],
  TN: [7, 2],
  TQ: [5, 1],
  TR: [6, 1],
  TS: [7, 1],
  TV: [5, 0],
  TW: [6, 0],
  TX: [7, 0],
};
