//
// Ported from https://observablehq.com/@scottwjones/lockdown-restriction-data
//

import { CompressOutlined } from "@mui/icons-material";
import { SemanticEvent } from "./SemanticEvent";
import { readCSVFile } from "./utils-data";

let countryRegions;
let countryRestrictionData;

async function initLockdownRestrictionData() {
  console.log("initLockdownRestrictionData:");
  let csv = await readCSVFile("/static/story-boards/englandCalendar@2.csv");
  const englandRestrictionData = csv.map((row) => {
    row.country = "England";
    return row;
  });
  const englishRegions = new Set(
    englandRestrictionData.map((e) => e["Local Authority"]),
  );

  csv = await readCSVFile("/static/story-boards/walesCalendar.csv");
  const walesRestrictionData = csv.map((row) => {
    row.country = "Wales";
    return row;
  });
  const welshRegions = Array.from(
    new Set(walesRestrictionData.map((e) => e["Local Authority"])),
  );

  csv = await readCSVFile("/static/story-boards/northernIrelandCalendar.csv");
  const northernIrelandRestrictionData = csv.map((row) => {
    row.country = "Northern Ireland";
    return row;
  });
  const northernIrelandRegions = Array.from(
    new Set(northernIrelandRestrictionData.map((e) => e["Local Authority"])),
  );

  csv = await readCSVFile("/static/story-boards/scotlandCalendar@1.csv");
  const scotlandRestrictionData = csv.map((row) => {
    row.country = "Scotland";
    return row;
  });
  const scottishRegions = Array.from(
    new Set(scotlandRestrictionData.map((e) => e["Local Authority"])),
  );

  countryRegions = {
    England: englishRegions,
    "Northern Ireland": northernIrelandRegions,
    Scotland: scottishRegions,
    Wales: welshRegions,
  };

  countryRestrictionData = {
    England: englandRestrictionData,
    "Northern Ireland": northernIrelandRestrictionData,
    Scotland: scotlandRestrictionData,
    Wales: walesRestrictionData,
  };
}

export async function getCalendarEvents(placeName, types) {
  await initLockdownRestrictionData();
  console.log("getCalendarEvents: countryRegions = ", countryRegions);
  console.log("countryRestrictionData = ", countryRestrictionData);

  // If given place name is a country we will use its first alphabetical local authority
  const isCountry = countryRegions[placeName];
  const localAuthority = isCountry ? [...isCountry][0] : placeName;

  console.log("isCountry = ", isCountry, ", localAuthority = ", localAuthority);

  let country;
  for (const key in countryRegions) {
    // console.log("key = ", key, "countryRegions[key] = ", countryRegions[key]);
    if ([...countryRegions[key]].includes(localAuthority)) country = key;
  }
  console.log("country = ", country);

  const localAuthorityData = countryRestrictionData[country].filter(
    (row) => row["Local Authority"] == localAuthority,
  );
  const events = [];
  let eventDates = [];
  types.forEach((type) => {
    switch (type) {
      case SemanticEvent.TYPES.LOCKDOWN:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setStart(d.start)
              .setEnd(d.end)
              .setDescription("National Lockdown begins."),
          ),
        );
        break;
      case SemanticEvent.TYPES.LOCKDOWN_START:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Start of National Lockdown."),
          ),
        );
        break;
      case SemanticEvent.TYPES.LOCKDOWN_END:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.end)
              .setType(type)
              .setDescription("End of National Lockdown."),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_1:
        eventDates = findEventStartEnd(
          "Pfizer Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Pfizer vaccine rollout begins."),
          ),
        );
        eventDates = findEventStartEnd(
          "Astrazeneca Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Astrazeneca rollout in the UK starts."),
          ),
        );
        eventDates = findEventStartEnd(
          "Moderna Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("First Moderna vaccines administered."),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_2:
        eventDates = findEventStartEnd(
          "Second Dose Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription(
                "First person in the UK given second dose of vaccine.",
              ),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_3:
        eventDates = findEventStartEnd(
          "Booster Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Booster campaign begins in the UK."),
          ),
        );
        break;
      default:
        break;
    }
  });
  return events;
}

const findEventStartEnd = (eventName, data) => {
  let prevValue = 0;
  let currValue = 0;
  let eventStart;
  const events = [];

  data.forEach((row, i) => {
    prevValue = currValue;
    currValue = row[eventName];

    if (prevValue == 0 && currValue == 1) {
      eventStart = new Date(row.Date);
    }

    if (
      (prevValue == 1 && currValue == 0) ||
      (prevValue == 1 && currValue == 1 && i == data.length - 1)
    ) {
      events.push({ start: eventStart, end: new Date(row.Date) });
    }
  });
  return events;
};
