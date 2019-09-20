import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfPlanningGridComponent } from './af-planning-grid/af-planning-grid.component';
import { AfAgGridModule } from '../af-ag-grid/af-ag-grid.module';
import { AgGridModule } from 'ag-grid-angular';
import { DropdownComponent } from '../af-ag-grid/af-ag-components/dropdown/dropdown.component';

@NgModule({
  declarations: [AfPlanningGridComponent],
  imports: [CommonModule, AfAgGridModule, AgGridModule.withComponents([DropdownComponent])],
  exports: [AfPlanningGridComponent]
})
export class AfPlanningModule {}
