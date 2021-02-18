import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit(loginData) {
    this.spinnerService.show();
    if (this.loginForm.invalid) {
      this.spinnerService.hide();
      return;
    }
    this.authService.SignIn(loginData.email,loginData.password,this.spinnerService);
    this.resetForm();
  }

  public resetForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

}
