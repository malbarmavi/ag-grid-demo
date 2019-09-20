import { GridOptions, GridReadyEvent, ColDef, Column, RowNode, ValueFormatterParams } from 'ag-grid-community';
import { AggFuncService } from 'ag-grid-enterprise';

interface AggregatorOptions {
  agg: Object;
  aggStatusPanel: Object;
}

// move to a separate helper function
let initialization = {
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
  },
  min: function(aggObj, colId) {
    aggObj[colId] = 0;
  },
  max: function(aggObj, colId) {
    aggObj[colId] = 0;
  }
};
let statObj = {};
// move to a separate helper function
let aggregationCalculation = {
  count: function(aggObj, colId) {
    aggObj[colId]++;
  },
  sum: function(aggObj, colId, value) {
    aggObj[colId] += value;
  },
  avg: function(aggObj, colId, value) {
    if (aggObj.sum > 0) {
      aggObj.sum += value;
    } else {
      aggObj.sum = value;
    }

    if (aggObj.count > 0) {
      aggObj.count++;
    } else {
      aggObj.count = 1;
    }

    let avg = Number(aggObj.sum / aggObj.count);
    aggObj[colId] = avg;
  },
  min: function(aggObj, colId, value) {
    statObj[colId].min = Math.min(statObj[colId].min, value);
    aggObj[colId] = statObj[colId].min;
  },
  max: function(aggObj, colId, value) {
    statObj[colId].max = Math.max(statObj[colId].max, value);
    aggObj[colId] = statObj[colId].max;
  }
};

export function AgGridAggregatorFactory(
  // Grid properties are available through the GridOptions interface.
  gridOptions: GridOptions,
  // AggregatorOptions - custom interface
  options: AggregatorOptions
) {
  function changeListener(params) {
    // place to store or the result of the aggregation
    let aggObj = {};
    let newAggObj = {}; // for pinned data
    // options: af-planning-grid.component.ts
    let aggCols = Object.keys(options.agg);
    // move this to a helper function
    aggCols.forEach(function(colId) {
      let aggType = options.agg[colId];
      // initialization sets the aggObj to zero. aggType - sum, count, etc
      let initializationFunction = initialization[aggType];
      // initialization function
      statObj[colId] = { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 };
      initializationFunction(aggObj, colId);
    });

    // iterate through every leaf node in the grid
    params.api.forEachLeafNode(function(node: RowNode) {
      // aggCols = [('k.0', 'f.0')];
      aggCols.forEach(function(colId) {
        // params.api.get;
        // Returns the column with the given 'key'. The key can either be the colId (a string) or the colDef (an object).
        let col = params.columnApi.getColumn(colId);
        // get column and RowNode value
        let value = params.api.getValue(col, node);
        if (!Number.isNaN(value)) {
          value = parseInt(value);
        }
        // aggType = count, sum etc.
        let aggType = options.agg[colId];
        // set count/sum/avg
        let aggregationFunction = aggregationCalculation[aggType];
        // pass the parameters to the aggregationCalculation function
        aggregationFunction(aggObj, colId, value);

        // count does not require 2 decimals places,
        if (aggObj.hasOwnProperty(colId)) {
          if (aggType == 'count') {
            newAggObj[colId] = aggObj[colId];
          } else {
            newAggObj[colId] = parseFloat(Number(aggObj[colId]).toFixed(2));
          }
        }
      });
    });
    // takes the aggObj and sets the pinned row data
    params.api.setPinnedBottomRowData([newAggObj]);
  }
  // make sure a defaultColDef object exists.
  gridOptions.defaultColDef = gridOptions.defaultColDef || {};
  Object.assign(gridOptions.defaultColDef, {
    pinnedRowValueFormatter: function(params: ValueFormatterParams) {
      return params.data[params.column.getColId()];
    }
  });
  Object.assign(gridOptions, {
    statusBar: {
      statusPanels: [
        // {
        //   statusPanel: 'agAggregationComponent',
        //   statusPanelParams: {
        //     aggFuncs: options.aggStatusPanel
        //   }
        // }
      ]
    }
  });
  // only have access to the grid after onGridReady
  onGridReady(gridOptions, function(params: GridReadyEvent, colDef: ColDef) {
    // put the code here that requires the api
    let eventArr = ['cellValueChanged'];
    // after an update - listen for the event cellValueChanged ...
    eventArr.forEach(eventType => {
      params.api.addEventListener(eventType, changeListener);
      eventType;
    });
    // aggregation is performed...
    changeListener(params);
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
