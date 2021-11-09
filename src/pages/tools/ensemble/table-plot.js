import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import ProgressJunk from "src/pages/tools/ensemble/progress-plot";

var table_controller;

const Styles = styled.div`
  width: 100%;
  height: 70%;
  max-height: 820px;
  max-width: 1500px;
  overflow-y: auto;

  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
          width: 200;
        }
      }
    }

    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      width: 50px;

      :last-child {
        border-right: 0;
      }
    }

    th {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      width: 200px;
      position: sticky;
      top: 0;
      background-color: coral;
      z-index: 1;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function preProcessing(options) {
  const data = options.data;
  const metadata = options.metadata;
  const retainedDimensions = options.retainedDimensions;
  const hasRetainedDimensions = retainedDimensions !== undefined;
  const dataKeys = Object.keys(data[0]);
  const columns = options.columns;
  table_controller = options.controller;

  var meanPercentages = {};

  // get data for each and sum of percentages for each column
  const percentages = data.map(function (key) {
    var percentage = {};
    for (let index in dataKeys) {
      let column = dataKeys[index];
      if (hasRetainedDimensions && retainedDimensions.includes(column)) {
        percentage[column] = key[column];
        meanPercentages[column] = key[column];
      } else {
        percentage[column] = parseInt((key[column] / metadata[column]) * 100);
        meanPercentages[column] =
          column in meanPercentages
            ? meanPercentages[column] + percentage[column]
            : percentage[column];
      }
    }
    return percentage;
  });

  // find average for each column
  for (let index in dataKeys) {
    let column = dataKeys[index];
    if (
      (hasRetainedDimensions && !retainedDimensions.includes(column)) ||
      !hasRetainedDimensions
    ) {
      meanPercentages[column] = parseInt(meanPercentages[column] / data.length);
    }
  }

  // visualize data for each row
  var displayedData = [];
  for (var i = 0; i < percentages.length; i++) {
    var displayedRow = [];
    for (let index in dataKeys) {
      let column = dataKeys[index];
      if (
        (hasRetainedDimensions && !retainedDimensions.includes(column)) ||
        !hasRetainedDimensions
      ) {
        var mean = meanPercentages[column];
        var value = percentages[i][column];
        displayedRow.push(<ProgressJunk value={value} mean={mean} />);
      } else {
        var value = percentages[i][column];
        displayedRow.push(value);
      }
    }
    displayedData.push(displayedRow);
  }

  return displayedData;
}

function getHeaders(columns) {
  var headers = [];

  headers.push(
    <th>
      Toggle<input type="checkbox" value="-1" onClick={toggleClick}></input>
    </th>,
  );

  for (var i = 0; i < columns.length; i++) {
    var header = columns[i].Header;
    headers.push(<th>{header}</th>);
  }
  return headers;
}

function makeTableRow(row, rowindex) {
  var rowValues = [];

  rowValues.push(
    <td>
      <input
        type="checkbox"
        value={row[0]}
        onClick={toggleClick}
        className="rowToggle"
        id={"row" + rowindex}
      ></input>
    </td>,
  );

  for (var i = 0; i < row.length; i++) {
    rowValues.push(<td>{row[i]}</td>);
  }

  if (rowindex === 0) {
    table_controller.tablePoints = [0];
  }

  return rowValues;
}

function makeTable(displayedData) {
  var tableData = [];
  for (var i = 0; i < displayedData.length; i++) {
    var row = makeTableRow(displayedData[i], i);
    tableData.push(<tr>{row}</tr>);
  }

  return tableData;
}

function toggleClick(event) {
  var togglePoint = event.target.value;
  var rowToggles = document.getElementsByClassName("rowToggle");

  if (togglePoint === "-1") {
    for (var i = 0; i < rowToggles.length; i++) {
      rowToggles[i].checked = event.target.checked;
    }

    if (!event.target.checked) {
      rowToggles[0].checked = true;
    }
  }

  var togglePoints = Array.from(rowToggles)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => parseInt(checkbox.value));
  table_controller.tableToggled(togglePoints);
}

function CustomTable(props) {
  var displayedData = preProcessing(props.options);
  var headers = getHeaders(props.options.columns);
  var tableBody = makeTable(displayedData);

  return (
    <div>
      <Styles>
        <table>
          <thead>
            <tr>{headers}</tr>
          </thead>

          <tbody>{tableBody}</tbody>
        </table>
      </Styles>
    </div>
  );
}

export default CustomTable;
