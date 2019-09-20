import {
  GridOptions,
  GridReadyEvent,
  ColDef,
  Column,
  RowNode,
  ValueFormatterParams
} from 'ag-grid-community';

interface AggregatorOptions {
  agg: Object;
}

let initializationLUT = {
  count: function(aggObj, colId) {
    aggObj[colId] = 0;
  },
  sum: function(aggObj, colId) {
    aggObj[colId] = 0;
  },
  avg: function(aggObj, colId) {
    aggObj[colId] = {
      count: 0,
      sum: 0
    };
  }
};

let LUT = {
  count: function(aggObj, colId) {
    aggObj[colId]++;
  },
  sum: function(aggObj, colId, value) {
    aggObj[colId] += value;
  },
  avg: function(aggObj, colId, value) {
    aggObj[colId].count++;
    aggObj[colId].sum += value;
  }
};

export function AgGridAggregatorFactory(
  gridOptions: GridOptions,
  options: AggregatorOptions
) {
  function changeListener(params) {
    let aggObj = {};

    let aggCols = Object.keys(options.agg);
    aggCols.forEach(function(colId) {
      let aggType = options.agg[colId];

      let initializationFunction = initializationLUT[aggType];
      initializationFunction(aggObj, colId);
    });

    // iterate through every leaf node in the grid
    params.api.forEachLeafNode(function(node: RowNode) {
      aggCols.forEach(function(colId) {
        let col = params.columnApi.getColumn(colId);
        let value = params.api.getValue(col, node);
        let aggType = options.agg[colId];

        let aggregationFunction = LUT[aggType];
        aggregationFunction(aggObj, colId, value);
      });
    });

    params.api.setPinnedBottomRowData([aggObj]);
  }

  gridOptions.defaultColDef = gridOptions.defaultColDef || {};
  Object.assign(gridOptions.defaultColDef, {
    pinnedRowValueFormatter: function(params: ValueFormatterParams) {
      return params.data[params.column.getColId()];
    }
  });

  onGridReady(gridOptions, function(params: GridReadyEvent, colDef: ColDef) {
    let eventArr = ['cellValueChanged'];
    eventArr.forEach(eventType => {
      params.api.addEventListener(eventType, changeListener);
    });
    changeListener(params);

    // this.gridApi = params.api;
    // sum into a container of rows
    // trigger a recalculation
    // set event handlers

    // this.gridApi.setPinnedBottomRowData(rows);
  });
}

function onGridReady(gridOptions, callback) {
  if (gridOptions.onGridReady) {
    var previousCallBack = gridOptions.onGridReady;

    gridOptions.onGridReady = function(event) {
      previousCallBack(event);
      callback(event);
    };
  } else {
    gridOptions.onGridReady = callback;
  }
}

//   gridOptions.api.setPinnedBottomRowData;
//FROM AG GRID RESOURCES
//   function onPinnedRowBottomCount() {
//     var footerRowsToFloat = document.getElementById('bottom-row-count').value;
//     var count = Number(footerRowsToFloat);
//     var rows = createData(count, 'Bottom');
//     this.gridApi.setPinnedBottomRowData(rows);
//   }
// onGridReady={this.onGridReady.bind(this)}"

// this.gridOptions.api.addAggFunc('abc', myCustomAggFunc);
// function myCustomAggFunc(values) {
//   var sum = 0;
//   values.forEach(function(value) {
//     sum += value;
//   });
//   return sum;
// }
