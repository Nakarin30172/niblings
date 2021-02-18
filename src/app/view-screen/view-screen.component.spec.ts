import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScreenComponent } from './view-screen.component';

describe('ViewScreenComponent', () => {
  let component: ViewScreenComponent;
  let fixture: ComponentFixture<ViewScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
