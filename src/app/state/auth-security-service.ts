// auth-security.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StateService, UserState } from './state-service';
import { AuthRequest } from './auth-request';
import { ENDPOINTS } from '@/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthSecurityService {

  ENDPOINTS = ENDPOINTS  
  private readonly TOKEN_KEY = 'app_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
    
  private tokenRefreshTimer$: Observable<number> | null = null;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) {
    this.initializeAuth();
  }

  // Initialize authentication state
  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      this.isAuthenticated$.next(true);
      this.setupTokenRefresh();
    } else {
      this.clearAuth();
    }
  }

  register(authRequest: AuthRequest): Observable<UserState> {
    return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.register, authRequest).pipe(
      tap(response => {
        console.log(response);
        this.storeAuthData(response);
        this.isAuthenticated$.next(true);
        this.setupTokenRefresh();
      }),
      map(response => this.extractUserState(response)),
      tap(user => this.stateService.setState({ user })),
      catchError(this.handleAuthError.bind(this))
    );
  }

  // Login
  login(authRequest: AuthRequest): Observable<UserState> {
    return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.login, authRequest).pipe(
      tap(response => {
        this.storeAuthData(response);
        this.isAuthenticated$.next(true);
        this.setupTokenRefresh();
      }),
      map(response => this.extractUserState(response)),
      tap(user => this.stateService.setState({ user })),
      catchError(this.handleAuthError.bind(this))
    );
  }

  // Logout
  logout(): Observable<void> {
    let refreshToken = { refreshToken: '' };
    return this.http.post<void>(ENDPOINTS.PERSONNEL.auth.logout, refreshToken).pipe(
      tap(() => this.clearAuth()),
      catchError(err => {
        this.clearAuth();
        return throwError(() => err);
      })
    );
  }

  // Refresh token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.refresh, { refreshToken }).pipe(
      tap(response => this.storeAuthData(response)),
      catchError(err => {
        this.clearAuth();
        return throwError(() => err);
      })
    );
  }

  // Setup automatic token refresh
  private setupTokenRefresh(): void {
    const expiry = this.getTokenExpiry();
    if (!expiry) return;

    const expiryTime = new Date(expiry).getTime();
    const now = Date.now();
    const refreshTime = expiryTime - now - (5 * 60 * 1000); // 5 mins before expiry

    if (refreshTime > 0) {
      this.tokenRefreshTimer$ = timer(refreshTime).pipe(
        switchMap(() => this.refreshToken()),
        shareReplay(1)
      );
      this.tokenRefreshTimer$.subscribe();
    }
  }

  // Store authentication data securely
  private storeAuthData(response: any): void {
    const { token, refreshToken, expiresIn } = response;
    
    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    
    const expiryDate = new Date(Date.now() + expiresIn);
    sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  }

  // Extract user state from response
  private extractUserState(response: any): UserState {
    return {
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
      permissions: response.user.permissions || [],
      token: response.token
    };
  }

  // Get token
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get token expiry
  getTokenExpiry(): string | null {
    return sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return new Date(expiry).getTime() <= Date.now();
  }

  // Check authentication status
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  // Clear authentication data
  clearAuth(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.isAuthenticated$.next(false);
    this.stateService.setState({ user: null });
  }

  // Handle authentication errors
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Authentication failed';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    this.stateService.setState({ error: errorMessage });
    return throwError(() => new Error(errorMessage));
  }
}