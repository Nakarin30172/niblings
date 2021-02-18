import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewDefectComponent } from './dialog-view-defect.component';

describe('DialogViewDefectComponent', () => {
  let component: DialogViewDefectComponent;
  let fixture: ComponentFixture<DialogViewDefectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewDefectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
