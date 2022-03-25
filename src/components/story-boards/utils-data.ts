import * as d3 from "d3";

export const readCSVFile = async (file: string) => {
  const csv = await d3.csv(file);
  console.log("readCSVFile: csv file = ", file, ",length = ", csv.length);
  return csv;
};

export const readJSONFile = async (file: string) => {
  const json = await d3.json(file);
  console.log("readJSONFile: json file = ", file);
  return json;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
