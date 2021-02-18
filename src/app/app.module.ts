import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { RequirementComponent } from './requirement/requirement.component';
import { TestcaseComponent } from './testcase/testcase.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ReqTraceabilityMatrixComponent } from './req-traceability-matrix/req-traceability-matrix.component';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Auth service
import { AuthService } from "./services/auth.service";
import { AddUserComponent } from './add-user/add-user.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewScreenComponent } from './view-screen/view-screen.component';
import { PlanTestExecutionComponent } from './plan-test-execution/plan-test-execution.component';
import { DialogAddScreenComponent } from './dialog-add-screen/dialog-add-screen.component';
import { DialogAddDefectComponent } from './dialog-add-defect/dialog-add-defect.component';
import { DialogViewDefectComponent } from './dialog-view-defect/dialog-view-defect.component';
import { DialogViewAddDefectComponent } from './dialog-view-add-defect/dialog-view-add-defect.component';
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
import { UploadService } from './uploads/shared/upload.service';
import { AngularFireDatabase } from '@angular/fire/database';
// 

import { MatDialogModule } from '@angular/material/dialog';
import { DialogOverviewExampleComponent } from './plan-test-execution/component/dialog-filter';

import { Defect1DetailComponent } from './defect1-detail/defect1-detail.component';


// Config Firebase

export const firebaseConfig = {
  apiKey: "AIzaSyBZKv3R4gFZJRAl9-kkrUGXZf-5t8EKn2U",
  authDomain: "test22-bfc65.firebaseapp.com",
  databaseURL: "https://test22-bfc65-default-rtdb.firebaseio.com",
  projectId: "test22-bfc65",
  storageBucket: "test22-bfc65.appspot.com",
  messagingSenderId: "115029126745",
  appId: "1:115029126745:web:df5459d81f7372a9274b48",
  measurementId: "G-T3SFHJDQNG"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RequirementComponent,
    TestcaseComponent,
    ManageUserComponent,
    AddUserComponent,
    ViewScreenComponent,
    PlanTestExecutionComponent,
    DialogAddScreenComponent,
    ReqTraceabilityMatrixComponent,
    DialogAddDefectComponent,
    DialogViewDefectComponent,
    DialogViewAddDefectComponent,
    UploadFormComponent,
    DialogOverviewExampleComponent,
    Defect1DetailComponent,
  ],
  exports: [
    MatDialogModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  entryComponents:[
    DialogAddScreenComponent,
    DialogAddDefectComponent,
    DialogViewDefectComponent,
    DialogViewAddDefectComponent,
    DialogOverviewExampleComponent,
  ],
  providers: [
    AuthService,
    AngularFireDatabase,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
