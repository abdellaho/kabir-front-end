// auth.interceptor.ts (Functional approach for Angular 20)
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, BehaviorSubject, filter, take, switchMap } from 'rxjs';
import { AuthSecurityService } from './auth-security-service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthSecurityService);

  // Add security headers
  let secureReq = req.clone({
    setHeaders: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY'
    }
  });

  // Add authentication token
  const token = authService.getToken();
  if (token && !authService.isTokenExpired()) {
    secureReq = secureReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(secureReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              refreshTokenSubject.next(response.token);
              return next(secureReq.clone({
                setHeaders: { Authorization: `Bearer ${response.token}` }
              }));
            }),
            catchError(err => {
              isRefreshing = false;
              authService.clearAuth();
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => next(secureReq.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            })))
          );
        }
      }
      return throwError(() => error);
    })
  );
};