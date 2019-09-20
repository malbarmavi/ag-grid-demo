import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './af-ag-components/dropdown/dropdown.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AfPlanningGridComponent } from '../af-planning/af-planning-grid/af-planning-grid.component';

@NgModule({
  declarations: [DropdownComponent],
  imports: [CommonModule, BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, NguiAutoCompleteModule],
  exports: []
})
export class AfAgGridModule {}
