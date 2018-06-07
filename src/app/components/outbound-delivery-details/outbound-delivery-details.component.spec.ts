import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundDeliveryDetailsComponent } from './outbound-delivery-details.component';

describe('OutboundDeliveryDetailsComponent', () => {
  let component: OutboundDeliveryDetailsComponent;
  let fixture: ComponentFixture<OutboundDeliveryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
