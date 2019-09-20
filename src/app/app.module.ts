import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'ag-grid-enterprise';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AfPlanningModule } from './af-planning/af-planning.module';
import { AfAgGridModule } from './af-ag-grid/af-ag-grid.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutoFocusDirective } from './auto-focus.directive';
import { DefFocusDirective } from './def-focus.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AfPlanningModule,
    AfAgGridModule,
    NguiAutoCompleteModule
  ],
  providers: [],
  declarations: [AppComponent, AutoFocusDirective, DefFocusDirective],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
