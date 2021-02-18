import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewAddDefectComponent } from './dialog-view-add-defect.component';

describe('DialogViewAddDefectComponent', () => {
  let component: DialogViewAddDefectComponent;
  let fixture: ComponentFixture<DialogViewAddDefectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewAddDefectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewAddDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
