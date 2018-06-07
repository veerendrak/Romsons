import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigValComponent } from './config-val.component';

describe('ConfigValComponent', () => {
  let component: ConfigValComponent;
  let fixture: ComponentFixture<ConfigValComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigValComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
