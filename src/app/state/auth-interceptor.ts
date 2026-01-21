// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthSecurityService } from './auth-security-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<any>(null);

    constructor(private authSecurityService: AuthSecurityService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add security headers
        let secureReq = this.addSecurityHeaders(req);
        // Skip adding token for login/register endpoints
        const skipAuth = req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh-token');

        // Add authentication token
        const token = this.authSecurityService.getToken();
        if (token && !this.authSecurityService.isTokenExpired() && !skipAuth) {
            secureReq = this.addToken(secureReq, token);
        }

        return next.handle(secureReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(secureReq, next);
                }
                return throwError(() => error);
            })
        );
    }

    // Add security headers
    private addSecurityHeaders(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                // Prevent MIME type sniffing
                'X-Content-Type-Options': 'nosniff',
                // XSS Protection
                'X-XSS-Protection': '1; mode=block',
                // Clickjacking protection
                'X-Frame-Options': 'DENY'
            }
        });
    }

    // Add authentication token
    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // Handle 401 errors with token refresh
    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authSecurityService.refreshToken().pipe(
                switchMap((response: any) => {
                    this.refreshTokenSubject.next(response.token);
                    return next.handle(this.addToken(req, response.token));
                }),
                catchError((err) => {
                    this.authSecurityService.clearAuth();
                    return throwError(() => err);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        } else {
            // Wait for token refresh to complete
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((token) => next.handle(this.addToken(req, token)))
            );
        }
    }
}
