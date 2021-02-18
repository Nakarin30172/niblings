import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ResponseAdd } from './responseAdd';
import { ResponseValidate } from './responseValidate';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient,
    
  ) { 
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user=>{
      if(user){
        this.userData = user;
      }else{
        localStorage.setItem('user',null);
      }
    })
  }

  // Sign in with email/password
  SignIn(email, password, spinnerService) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          if(result.user.emailVerified){
            this.afs.doc('User/'+result.user.uid).valueChanges().subscribe(resUser =>{
              let user = resUser;
              localStorage.setItem('user',JSON.stringify(user));
              this.router.navigate(['requirement']);
              spinnerService.hide();
            });
          }else{
            this.SignOut();
            window.alert("Please check your email and click on the link to verfiy your email before login");
            spinnerService.hide();
          }
        });
      }).catch((error) => {
        window.alert(error.message);
        spinnerService.hide();
      })
  }

  // Sign up with email/password
  CreateUser(email, password) : Observable<ResponseAdd>{
    var urlCreate = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZKv3R4gFZJRAl9-kkrUGXZf-5t8EKn2U";
    var body = {"email":email,"password":password,"returnSecureToken":true};
    return this.http.post<ResponseAdd>(urlCreate,body)
      .pipe(
        catchError((error:any) => throwError(error))
      );
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  get isLoggedIn():boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null)?true:false;
  }

  get isAdmin():boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.UPosition === "Admin")?true:false;
  }

  get isBa():boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.UPosition === "BA")?true:false;
  }

  get isBaDev():boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.UPosition === "BA" || user.UPosition === "Developer")?true:false;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(userid, email, role, fullname, description) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc('User/'+userid);
    const userData: User = {
      idU: userid,
      UEmail: email,
      UPosition: role,
      UName: fullname,
      UDes: description
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SendVerificationMail(idToken) {
    var urlValidate= "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBZKv3R4gFZJRAl9-kkrUGXZf-5t8EKn2U";
    var body = {"requestType":"VERIFY_EMAIL","idToken":idToken};
    return this.http.post<ResponseValidate>(urlValidate,body)
      .pipe(
        catchError((error:any) => throwError(error))
      );
  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

}
