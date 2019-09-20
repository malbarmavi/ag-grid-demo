import { Directive, OnInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective {
  @Input() public appAutoFocus: boolean;

  public constructor(private el: ElementRef) {}

  public ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500);
  }
}
