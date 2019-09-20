import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfPlanningGridComponent } from './af-planning-grid.component';

describe('AfPlanningGridComponent', () => {
  let component: AfPlanningGridComponent;
  let fixture: ComponentFixture<AfPlanningGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfPlanningGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfPlanningGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
