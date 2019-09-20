import { GridOptions, ZipContainer } from 'ag-grid-community';
import { localeText } from './af-ag-grid-helpers/grid-constants';

// AgGridBasicFactory sets our (Anafee's) default values rather than ag-grids default values
export function AgGridBasicFactory(gridOptions: GridOptions, options: Object) {
  Object.assign(gridOptions, {
    // https://www.ag-grid.com/javascript-grid-internationalisation/
    // default grid options
    localeText: localeText,
    suppressCellSelection: false,

    rowSelection: 'multiple',
    rowDeselection: true,
    stopEditingWhenGridLosesFocus: true,
    enterMovesDownAfterEdit: true,
    enterMovesDown: true,
    groupDefaultExpanded: 9999,
    groupSelectsChildren: true,
    pivotPanelShow: 'never'
  });
  // make sure a context object exists.
  gridOptions.context = gridOptions.context || {};
  // make sure a defaultColDef object exists.
  gridOptions.defaultColDef = gridOptions.defaultColDef || {};
  Object.assign(gridOptions.defaultColDef, {
    // default options applied to all tables
    cellStyle: {
      height: '175px',
      'text-align': 'left',
      'z-index': '1'
      // border: 'none'
      // 'background-color': '#fff'
      // border: '1px solid #f0a322',
      // 'background-color': '#fff'
      // overflow: 'auto'
      // border: '1px solid #3a3a3a'
    },
    // autoHeight: true, // causes issues, of not displaying
    sortable: true,
    filter: true,
    menuTabs: ['filterMenuTab'],
    resizable: true
  });
  // make sure a defaultColGroupDef object exists.
  gridOptions.defaultColGroupDef = gridOptions.defaultColGroupDef || {
    children: []
  };
  Object.assign(gridOptions.defaultColGroupDef, {
    // default options applied to all tables
    marryChildren: true,
    openByDefault: true
    // cellEditor: 'CustomTooltipComponent'
  });
  // make sure a autoGroupColumnDef object exists.
  gridOptions.autoGroupColumnDef = gridOptions.autoGroupColumnDef || {};
  Object.assign(gridOptions.autoGroupColumnDef, {
    // default options applied to all tables
    suppressMenu: true,
    suppressMovable: true,
    pinned: 'left',
    editable: true
  });
  return;
}
