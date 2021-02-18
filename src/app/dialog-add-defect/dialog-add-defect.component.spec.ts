import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddDefectComponent } from './dialog-add-defect.component';

describe('DialogAddDefectComponent', () => {
  let component: DialogAddDefectComponent;
  let fixture: ComponentFixture<DialogAddDefectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddDefectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
