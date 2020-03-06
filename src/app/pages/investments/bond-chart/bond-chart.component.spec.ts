import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BondChartComponent } from './bond-chart.component';

describe('BondChartComponent', () => {
  let component: BondChartComponent;
  let fixture: ComponentFixture<BondChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BondChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
