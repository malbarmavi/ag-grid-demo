import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
// import { AgGridComponentsFactory } from '../../af-ag-grid/af-ag-grid-components.module';
import { AgGridBasicFactory } from 'src/app/af-ag-grid/af-ag-grid-basic.factory';
import { AgGridAggregatorFactory } from 'src/app/af-ag-grid/af-ag-grid-aggregator.factory';
import { AgGridTestFactory } from 'src/app/af-ag-grid/af-ag-grid-test.factory';
import { RowData } from '../../hardcoded-data/row-data';
import { ColumnData } from '../../hardcoded-data/column-data';
import { DropdownComponent } from 'src/app/af-ag-grid/af-ag-components/dropdown/dropdown.component';


@Component({
  selector: 'app-af-planning-grid',
  templateUrl: './af-planning-grid.component.html',
  styleUrls: ['./af-planning-grid.component.scss']
})
export class AfPlanningGridComponent {
  public rangeSum;
  public rangeMin;
  public rangeMax;
  public rangeAvg;
  public gridOptions: GridOptions;
  private rowClassRules;

  constructor() {
    const gridOptions = {
      frameworkComponents: {
        editComp: DropdownComponent,
      },
      defaultColDef: {
        // width: 175,
        // editable: true
      },
      columnTypes: {}
    };

    AgGridBasicFactory(gridOptions, {});
    // AgGridComponentsFactory(gridOptions, {});
    AgGridAggregatorFactory(gridOptions, {
      aggStatusPanel: ['count', 'sum', 'min', 'max', 'avg'],
      agg: {
        // 1st Group
        'k.0': 'count',
        'k.1': 'count',
        // 2nd Group
        'f.0': 'count',
        'f.1': 'avg',
        'f.2': 'sum',
        'f.3': 'min',
        'f.4': 'max'
      }
    });
    // AgGridRangeSelectorFactory(gridOptions, {});
    this.gridOptions = gridOptions;
    this.gridOptions.rowData = RowData;
    this.gridOptions.columnDefs = ColumnData;
    // this.gridOptions.rowStyle = "color: red";
  }

  ngOnInit() {}
}
