import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsGalleryComponent } from './reports-gallery.component';

describe('ReportsGalleryComponent', () => {
  let component: ReportsGalleryComponent;
  let fixture: ComponentFixture<ReportsGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
