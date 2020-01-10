import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CentralisationService} from './centralisation.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private variable: CentralisationService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
    if (this.variable.isAuth) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
