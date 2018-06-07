import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAchievementReportComponent } from './target-achievement-report.component';

describe('TargetAchievementReportComponent', () => {
  let component: TargetAchievementReportComponent;
  let fixture: ComponentFixture<TargetAchievementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetAchievementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAchievementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
