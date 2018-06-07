import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntransitDetailsComponent } from './intransit-details.component';

describe('IntransitDetailsComponent', () => {
  let component: IntransitDetailsComponent;
  let fixture: ComponentFixture<IntransitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntransitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntransitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
