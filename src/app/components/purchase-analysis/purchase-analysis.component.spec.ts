import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAnalysisComponent } from './purchase-analysis.component';

describe('PurchaseAnalysisComponent', () => {
  let component: PurchaseAnalysisComponent;
  let fixture: ComponentFixture<PurchaseAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
