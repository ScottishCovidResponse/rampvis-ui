export function findMaxValue(obj) {
  let max = 0;
  for (const res in obj) {
    for (const dat in obj[res]) {
      if (obj[res][dat]["measurement"] > max) {
        max = obj[res][dat]["measurement"];
      }
    }
  }
  return max;
}

export function findMinValue(obj) {
  let min = Infinity;
  for (const res in obj) {
    for (const dat in obj[res]) {
      if (obj[res][dat]["measurement"] < min) {
        min = obj[res][dat]["measurement"];
      }
    }
  }
  return min;
}
