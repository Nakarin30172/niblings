import { Component } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'NIBLINGS';
  Userfullname = '';
  isNotViewScreen;

  constructor(
    private authService: AuthService,
    private permissionsService: NgxPermissionsService,
    private router:Router
  ) { 
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
          this.isNotViewScreen = !(event.url.includes("/viewScreen"));
          console.log("isNotView "+this.isNotViewScreen);
      }
    });
    const user = JSON.parse(localStorage.getItem('user'));
    if(user!=null){
      this.Userfullname = user.UName;
    }
  }

  ngOnInit(): void {
    const perm = [JSON.parse(localStorage.getItem('user')).UPosition];
    this.permissionsService.loadPermissions(perm);
  }

  public doLogout(){
    this.authService.SignOut();
  }

  public isLogin(){
    return this.authService.isLoggedIn;
  }
}
