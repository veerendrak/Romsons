import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessPartnersComponent } from './bussiness-partners.component';

describe('BussinessPartnersComponent', () => {
  let component: BussinessPartnersComponent;
  let fixture: ComponentFixture<BussinessPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
