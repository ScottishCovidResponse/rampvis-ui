import Papa from "papaparse";

export const readCSVFile = async (file: string) => {
  const response = await fetch(file);
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder("utf-8");
  const csv = Papa.parse(decoder.decode(result.value), {
    header: true,
  }).data;
  console.log("readCSVFile: csv data = ", csv);

  return csv;
};

export const readJSONFile = async (file: string) => {
  const response = await fetch(file);
  const arrayObj = await response.json();
  console.log("readJSONFile: json data = ", arrayObj);

  return arrayObj;
};
