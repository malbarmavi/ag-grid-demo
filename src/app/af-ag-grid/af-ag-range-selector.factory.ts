// import {
//   GridOptions,
//   GridReadyEvent,
//   ColDef,
//   Column,
//   RowNode,
//   ValueFormatterParams
// } from 'ag-grid-community';
// // import { AggFuncService } from 'ag-grid-enterprise';

// export function AgGridRangeSelectorFactory(
//   gridOptions: GridOptions,
//   options: Object
// ) {
//   function onRangeSelectionChanged(params) {
//     console.log('params', params.api);
//     this.cellRanges = params.api.getCellRanges();
//     // if we dont have cell range then...
//     if (!this.cellRanges || this.cellRanges.length === 0) {
//       return;
//     }
//     // this.lbRangeCount.innerHTML = cellRanges.length;
//     let cellRanges = gridOptions.api.getCellRanges();
//     // let cellRanges = gridOptions.cellRanges();
//     let firstRange = cellRanges[0];
//     console.log('firstRange', firstRange);
//     let sum = 0;
//     let arrMin = [];
//     let arrMax = [];
//     let arrAvg = [];
//     // identify startRow
//     let startRow = Math.min(
//       firstRange.startRow.rowIndex,
//       firstRange.endRow.rowIndex
//     );
//     // identify endRow
//     let endRow = Math.max(
//       firstRange.startRow.rowIndex,
//       firstRange.endRow.rowIndex
//     );
//     let api = this.gridOptions.api;
//     for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
//       firstRange.columns.forEach(function(column) {
//         let rowModel = api.getModel();
//         let rowNode = rowModel.getRow(rowIndex);
//         let value = api.getValue(column, rowNode);
//         if (typeof value === 'number') {
//           sum += value;
//           arrMin.push(value);
//           arrMax.push(value);
//           arrAvg.push(value);
//         }
//       });
//     }
//     // // MIN
//     console.log('min:', Math.min(...arrMin));
//     // this.rangeMin.innerHTML = Math.min(...arrMin);
//     // // MAX
//     console.log('max:', Math.max(...arrMax));
//     // this.rangeMax.innerHTML = Math.max(...arrMax);
//     // // AVERAGE
//     // this.rangeAvg.innerHTML = arrAvg.reduce((a, b) => a + b) / arrAvg.length;
//     // // SUM
//     // this.rangeSum.innerHTML = sum;
//   }

//   // onClearRange() {
//   //   console.log('onClearRange');
//   //   this.gridOptions.api.clearRangeSelection();
//   // };

//   // only have access to the grid after onGridReady
//   // onGridReady(gridOptions, function(params: GridReadyEvent) {
//   //   console.log('hi');
//   //   // put the code here that requires the api
//   //   let eventArr = ['cellValueChanged'];
//   //   // after an update - listen for the event cellValueChanged ...
//   //   eventArr.forEach(eventType => {
//   //     params.api.addEventListener(eventType, onRangeSelectionChanged);
//   //     eventType;
//   //   });
//   //   // aggregation is performed...
//   //   onRangeSelectionChanged(params);
//   //   console.log('params', params);
//   // });
//   onGridReady(gridOptions, function(params: GridReadyEvent) {
//     console.log('onGridReady', params);
//     // this.gridOptions.api = params.api;
//     // this.gridOptions.this.gridOptions.columnApi = params.columnApi;
//     onRangeSelectionChanged(params);
//   });
// }

// function onGridReady(gridOptions, callback) {
//   if (gridOptions.onGridReady) {
//     var previousCallBack = gridOptions.onGridReady;

//     gridOptions.onGridReady = function(event) {
//       previousCallBack(event);
//       callback(event);
//     };
//   } else {
//     gridOptions.onGridReady = callback;
//   }
// }

// // function onGridReady(gridOptions, callback) {
// //   if (gridOptions.onGridReady) {
// //     var previousCallBack = gridOptions.onGridReady;

// //     gridOptions.onGridReady = function(event) {
// //       previousCallBack(event);
// //       callback(event);
// //     };
// //   } else {
// //     gridOptions.onGridReady = callback;
// //   }
// // }

// /////////////////////////////////////// range selector //////////////////////////////////////////

// // aggregation is performed...
// // changeListener(params);

// //   Object.assign(gridOptions, {
// //     // default options applied to all tables
// //     statusBar: {
// //       statusPanels: [
// //         {
// //           statusPanel: 'statusBarComponent'
// //         },
// //         {
// //           statusPanel: 'agAggregationComponent',
// //           statusPanelParams: {
// //             // only show count and sum ('min', 'max', 'avg' won't be shown)
// //             aggFuncs: ['count', 'sum']
// //           }
// //         }
// //       ]
// //     }
// //   });
