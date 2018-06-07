import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingPaymentComponent } from './outgoing-payment.component';

describe('OutgoingPaymentComponent', () => {
  let component: OutgoingPaymentComponent;
  let fixture: ComponentFixture<OutgoingPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
