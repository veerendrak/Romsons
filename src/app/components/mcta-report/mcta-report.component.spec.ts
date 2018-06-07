import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MctaReportComponent } from './mcta-report.component';

describe('MctaReportComponent', () => {
  let component: MctaReportComponent;
  let fixture: ComponentFixture<MctaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MctaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MctaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
