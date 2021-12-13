export type GlyphMapRecord = {
  x: number;
  y: number;
  data: number[][];
};

// TODO: use third-party typings when available
export interface VirtualHdf5File {
  get: <T>(query: string) => { value: T };
}
