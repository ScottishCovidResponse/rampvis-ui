export class LookupTable {
  _csv;

  constructor(csv) {
    this._csv = csv;
  }

  lookup(eventObj) {
    // Find csv entry by matching with "type" column
    const matchingEntry = this._csv.find(
      (entry) => entry.type == eventObj.type,
    );
    if (!matchingEntry)
      throw "Couldn't find event type in lookup table! Remember to update csv.";

    return matchingEntry;
  }

  generateOutput(eventObj) {
    const entry = this.lookup(eventObj);
    // Create and array of eventObj parameters by splitting string list (i.e. "elem1, elem2, ...").
    const parameters = entry.parameters.split(", ");

    // Get keys of all defined outputs for entry type.
    const outputKeys = Object.keys(entry).filter((k) => k.includes("output"));

    // Choose a random key and get output template.
    const randomKey = outputKeys[Math.floor(Math.random() * outputKeys.length)];
    let randomOutput = entry.output1; //use entry[randomkey] for random output

    // Replace each instance of a param token (e.g. "HEIGHT") with real value in eventObj.
    parameters.forEach((param) => {
      randomOutput = randomOutput.replace(param, eventObj[param.toLowerCase()]);
    });

    return this._formatOutput(randomOutput);
  }

  _formatOutput(str) {
    // Auto capitalise the starts of sentences and words following punctuation
    // Solution sourced from: https://stackoverflow.com/a/39920075
    const regex = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(regex, (_, $1, $2) => $1 + $2.toUpperCase());
  }
}
