import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SecureAdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean{
      if(this.authService.isAdmin){
        return true;
      }else{
        window.alert("You are not have permission to access this URL!");
        this.router.navigate(['requirement'])
      }
    }

}
