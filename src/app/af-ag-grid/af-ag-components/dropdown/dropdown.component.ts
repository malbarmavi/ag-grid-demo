import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgEditorComponent, ICellEditorAngularComp } from 'ag-grid-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ICellEditorParams } from 'ag-grid-community';
import { ColumnData } from '../../../hardcoded-data/column-data';
import { FormGroup, FormBuilder } from '@angular/forms';
import { timeout } from 'q';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, AgEditorComponent {
  @Input() name: String;
  public dropdownData = ColumnData[0].cellEditorParams.values;
  public myForm: FormGroup;
  public value: String;
  public oldValue: String;
  public selected: Boolean;
  public params: ICellEditorParams;

  @ViewChild('agInput', { static: true }) public elm: ElementRef;

  constructor(private builder: FormBuilder, private _sanitizer: DomSanitizer) { }

  isPopup(): boolean {
    return false;
  }
  refresh(params: ICellEditorParams) {
    params;
    console.log('reffffff 🔥🔥')
    this.params.api.refreshCells();
    console.log('refresh..............');
    return true;
  }

  getValue(): String {
    console.log('getValue', this.value);
    if (this.value === '') {
      this.value = this.oldValue;
    }

    return this.value;
  }

  agInit(params: ICellEditorParams) {
    console.log('agInit..............', 'params:', params);
    this.value = params.value;
    console.log('aginit', this.value);
    this.oldValue = this.value;
    this.value = '';
    // document.getElementById('input-dropdown').focus();
    return this.value;
  }



  ngOnInit() {
    this.myForm = this.builder.group({
      gridDropdown: ''
    });
  }
  onClick(selected: boolean) {
    console.log('onclicks.........');
    // this.setSelected(selected);
    // this.params.api.stopEditing();
  }

  // dropdown
  autocompleListFormatter = (data: any) => {
    console.log('autocompleListFormatter..............');
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  setFocus() {
    this.elm.nativeElement.focus();
  }



}
// setSelected(selected): void {
//   console.log('test');
//   this.value = selected;
//   console.log('setSelected..............');
// }

// onClick(selected: boolean) {
//   console.log('test on clicks');
//   this.setSelected(selected);
//   this.params.api.stopEditing();
//   console.log('onClick..............');
// }
