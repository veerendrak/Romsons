import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundDeliveryComponent } from './outbound-delivery.component';

describe('OutboundDeliveryComponent', () => {
  let component: OutboundDeliveryComponent;
  let fixture: ComponentFixture<OutboundDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
