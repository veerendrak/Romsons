import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingPaymentsListComponent } from './incoming-payments-list.component';

describe('IncomingPaymentsListComponent', () => {
  let component: IncomingPaymentsListComponent;
  let fixture: ComponentFixture<IncomingPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingPaymentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
