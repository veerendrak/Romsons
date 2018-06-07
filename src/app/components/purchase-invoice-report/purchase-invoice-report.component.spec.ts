import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceReportComponent } from './purchase-invoice-report.component';

describe('PurchaseInvoiceReportComponent', () => {
  let component: PurchaseInvoiceReportComponent;
  let fixture: ComponentFixture<PurchaseInvoiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
