import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelarshipDetailsComponent } from './delarship-details.component';

describe('DelarshipDetailsComponent', () => {
  let component: DelarshipDetailsComponent;
  let fixture: ComponentFixture<DelarshipDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelarshipDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelarshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
