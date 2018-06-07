import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigValuesDetailsComponent } from './config-values-details.component';

describe('ConfigValuesDetailsComponent', () => {
  let component: ConfigValuesDetailsComponent;
  let fixture: ComponentFixture<ConfigValuesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigValuesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigValuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
