import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTestExecutionComponent } from './plan-test-execution.component';

describe('PlanTestExecutionComponent', () => {
  let component: PlanTestExecutionComponent;
  let fixture: ComponentFixture<PlanTestExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTestExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTestExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
