import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUserDetailsComponent } from './active-user-details.component';

describe('ActiveUserDetailsComponent', () => {
  let component: ActiveUserDetailsComponent;
  let fixture: ComponentFixture<ActiveUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
