import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr1ReportComponent } from './gstr1-report.component';

describe('Gstr1ReportComponent', () => {
  let component: Gstr1ReportComponent;
  let fixture: ComponentFixture<Gstr1ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gstr1ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gstr1ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
