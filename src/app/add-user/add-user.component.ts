import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseAdd } from '../services/responseAdd';
import { ResponseValidate } from '../services/responseValidate';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.sass']
})
export class AddUserComponent implements OnInit {

  addUserForm;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.addUserForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      role: ['Developer', Validators.required],
      fullname: ['', Validators.required],
      description: '',
    });
  }

  ngOnInit() {
  }

  onSubmit(userData) {
    this.spinnerService.show();
    if (this.addUserForm.invalid) {
      this.spinnerService.hide();
      return;
    }
    // Process checkout data here
    this.authService.CreateUser(userData.email,userData.password)
    .subscribe((responseAdd:ResponseAdd) => {
      this.authService.SendVerificationMail(responseAdd.idToken)
      .subscribe((responseValidate:ResponseValidate) => {
        window.alert("We have sent a confirmation email to email "+responseValidate.email+"\n"+
        "Please check email and click on the link to verfiy email address.");
        this.authService.SetUserData(responseAdd.localId,userData.email,userData.role,userData.fullname,userData.description);
        this.spinnerService.hide();
      },(responseValidateError:ResponseValidate) => {
        this.spinnerService.hide();
        window.alert(responseValidateError.error);
      });
    },(responseAddError:ResponseAdd) => {
      this.spinnerService.hide();
      window.alert(responseAddError.error);
    });
    this.resetForm();
  }

  public resetForm(){
    this.addUserForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      role: ['Developer', Validators.required],
      fullname: ['', Validators.required],
      description: '',
    });
  }

}
