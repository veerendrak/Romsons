import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingPaymentsListComponent } from './outgoing-payments-list.component';

describe('OutgoingPaymentsListComponent', () => {
  let component: OutgoingPaymentsListComponent;
  let fixture: ComponentFixture<OutgoingPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingPaymentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
