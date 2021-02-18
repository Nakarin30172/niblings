import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementComponent } from './requirement/requirement.component';
import { TestcaseComponent } from './testcase/testcase.component';
import { ReqTraceabilityMatrixComponent } from './req-traceability-matrix/req-traceability-matrix.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { Defect1DetailComponent } from './defect1-detail/defect1-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { SecureInnerPagesGuard } from './guards/secure-inner-pages.guard';
import { SecureAdminGuard } from './guards/secure-admin.guard';
import { SecureNotBaGuard } from './guards/secure-not-ba.guard';
import { SecureNotBaDevGuard } from './guards/secure-not-ba-dev.guard';
import { ViewScreenComponent } from './view-screen/view-screen.component';
import { PlanTestExecutionComponent } from './plan-test-execution/plan-test-execution.component'
 
// Import canActivate guard services


const routes: Routes = [
  {
    path: '', 
    redirectTo: '/requirement', pathMatch: 'full'
  },
  {
    path: 'requirement',
    component: RequirementComponent,
    canActivate: [AuthGuard]
  },
  /*
  {
    path: 'screen-design',
    component: ScreenDesignComponent,
    canActivate: [AuthGuard]
  },
  */
  {
    path: 'plan-test-execution',
    component: PlanTestExecutionComponent,
    canActivate: [AuthGuard,SecureNotBaDevGuard]
  },
  /*
  {
    path: 'plan-test-case',
    component: PlanTestCaseComponent,
    canActivate: [AuthGuard,SecureNotBaDevGuard]
  },
  {
    path: 'plan-test-scenario',
    component: PlanTestScenarioComponent,
    canActivate: [AuthGuard,SecureNotBaDevGuard]
  },
  */
  {
    path: 'testcase',
    component: TestcaseComponent,
    canActivate: [AuthGuard,SecureNotBaGuard]
  },
  /*
  {
    path: 'user-scenario',
    component: UserScenarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-scenario',
    component: TestScenarioComponent,
    canActivate: [AuthGuard]
  },
  */
  /*
  {
    path: 'defect',
    component: DefectComponent,
    canActivate: [AuthGuard,SecureNotBaGuard]
  },
  
  /*
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [AuthGuard,SecureNotBaGuard]
  },
  */
  {
    path : 'requirement-traceability-matrix',
    component : ReqTraceabilityMatrixComponent,
    canActivate: [AuthGuard,SecureNotBaGuard]
  },
  {
    path: 'manage-user',
    component: ManageUserComponent,
    canActivate: [AuthGuard,SecureAdminGuard]
  },
  {
    path: 'Defect',
    component: Defect1DetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [AuthGuard,SecureAdminGuard]
  }
  ,
  {
    path: 'viewScreen',
    component: ViewScreenComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
