import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddScreenComponent } from './dialog-add-screen.component';

describe('DialogAddScreenComponent', () => {
  let component: DialogAddScreenComponent;
  let fixture: ComponentFixture<DialogAddScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
