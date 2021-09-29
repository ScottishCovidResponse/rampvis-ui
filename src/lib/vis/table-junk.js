import React from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, useRowSelect } from 'react-table'
import ReactDOM from 'react-dom'
import ProgressJunk from "src/lib/vis/progress-junk"

export class TableJunk {

  constructor(options) {
    const data = options.data;
    const metadata = options.metadata;
    const retainedDimensions = options.retainedDimensions;
    const hasRetainedDimensions = (retainedDimensions !== undefined);
    const dataKeys = Object.keys(data[0])
    const columns = options.columns;
    var meanPercentages = {};

    const percentages = data.map(function (key) {
      var percentage = {}
      for (let index in dataKeys) {
        let column = dataKeys[index]
        if (hasRetainedDimensions && retainedDimensions.includes(column)) {
          percentage[column] = <b>{key[column]}</b>
          meanPercentages[column] = key[column]
        }
        else {
          percentage[column] = parseInt((key[column] / metadata[column]) * 100)
          meanPercentages[column] = column in meanPercentages ? (meanPercentages[column] + percentage[column]) : (percentage[column])
        }
      }
      return percentage
    })

    for (let index in dataKeys) {
      let column = dataKeys[index]
      if ((hasRetainedDimensions && !(retainedDimensions.includes(column))) || (!hasRetainedDimensions)) {
        meanPercentages[column] = parseInt(meanPercentages[column] / (data.length))
        var mean = meanPercentages[column]
        columns[index].Cell = function ({ cell: { value } }) {
          return <ProgressJunk value={value} mean={mean} />
        }
      }
    }

    ReactDOM.render(<Styles><Table columns={columns} data={percentages} /></Styles>, document.getElementById(options.chartElement));
  }

  render(){
    this.forceUpdate();
 }

}

const Styles = styled.div`
  width: 70%;
  height: 70%;
  max-height: 500px;
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: scroll;

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

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      // width: 150px;
      // overflow: hidden;
      // display: inline-block;
      // white-space: nowrap;

      :last-child {
        border-right: 0;
      }
    }
    

  }
`

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return <input type="checkbox" ref={resolvedRef} {...rest} />
  }
)

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable({
    columns,
    data
  },
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}{ }
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? '⬇'
                      : '⬆'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  )
                })}
              </tr>
            )
          }
        )}
      </tbody>
    </table>
  )

}

export default TableJunk
