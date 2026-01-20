import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthSecurityService } from '../auth-security-service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(
        private authService: AuthSecurityService,
        private router: Router
    ) {}

    canActivate(): boolean | UrlTree {
        const token = this.authService.getToken();
        const isExpired = this.authService.isTokenExpired();
        console.log('token', token, 'isExpired', isExpired);

        // If already authenticated, redirect to home
        if (token && !isExpired) {
            return this.router.createUrlTree(['/']);
        }

        // Otherwise, allow access to login page
        return true;
    }
}
