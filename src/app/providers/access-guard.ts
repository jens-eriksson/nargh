import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationProvider } from './authentication';

@Injectable()
export class AccessGuardProvider implements CanActivate {
    constructor(
        public authProvider: AuthenticationProvider,
        public router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.authProvider.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['sign-in']);
            return false;
        }
    }
}
