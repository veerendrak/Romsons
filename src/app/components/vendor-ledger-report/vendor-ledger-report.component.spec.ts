import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLedgerReportComponent } from './vendor-ledger-report.component';

describe('VendorLedgerReportComponent', () => {
  let component: VendorLedgerReportComponent;
  let fixture: ComponentFixture<VendorLedgerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorLedgerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
