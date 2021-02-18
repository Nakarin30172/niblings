import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Defect1DetailComponent } from './defect1-detail.component';

describe('Defect1DetailComponent', () => {
  let component: Defect1DetailComponent;
  let fixture: ComponentFixture<Defect1DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Defect1DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Defect1DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
