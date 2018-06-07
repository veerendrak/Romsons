import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoodsReceiptComponent } from './edit-goods-receipt.component';

describe('EditGoodsReceiptComponent', () => {
  let component: EditGoodsReceiptComponent;
  let fixture: ComponentFixture<EditGoodsReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoodsReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoodsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
