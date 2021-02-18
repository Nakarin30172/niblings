import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqTraceabilityMatrixComponent } from './req-traceability-matrix.component';

describe('ReqTraceabilityMatrixComponent', () => {
  let component: ReqTraceabilityMatrixComponent;
  let fixture: ComponentFixture<ReqTraceabilityMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqTraceabilityMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqTraceabilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
