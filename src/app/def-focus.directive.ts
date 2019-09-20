import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[defFocus]'
})
export class DefFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    console.log('rendered 😁');
    setTimeout(() => {
      console.log(this.el.nativeElement.focus());

    }, 1000);
  }

  setFocus() {
    this.el.nativeElement.focus();
  }
}
