import Papa from "papaparse";

export const fetchCSV = async (file: string) => {
  const response = await fetch(file);
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder("utf-8");
  const csv = Papa.parse(decoder.decode(result.value), {
    header: true,
  }).data; // object with { data, errors, meta } // array of objects
  console.log("fetchCSV: csv = ", csv);

  return csv;
};
