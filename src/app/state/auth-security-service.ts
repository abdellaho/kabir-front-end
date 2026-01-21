// auth-security.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, throwError, of, fromEvent, merge } from 'rxjs';
import { map, switchMap, tap, catchError, shareReplay, finalize, debounceTime } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StateService, UserState } from './state-service';
import { AuthRequest } from './auth-request';
import { ENDPOINTS } from '@/config/endpoints';
import { Erreur } from '@/shared/classes/erreur';

@Injectable({
    providedIn: 'root'
})
export class AuthSecurityService {
    ENDPOINTS = ENDPOINTS;
    private readonly TOKEN_KEY = 'app_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
    private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

    private tokenRefreshTimer$: Observable<number> | null = null;
    private isAuthenticated$ = new BehaviorSubject<boolean>(false);
    private userFetchInProgress = false;
    private inactivityTimer: any;
    private lastActivityTime: number = Date.now();

    constructor(
        private http: HttpClient,
        private stateService: StateService
    ) {
        // Do NOT call initializeAuth here - it will be called via APP_INITIALIZER
        // Only setup activity listeners
        this.setupActivityListeners();
    }

    // Public method called by APP_INITIALIZER to restore session
    checkAndRestoreSession(): Observable<any> {
        const token = this.getToken();
        if (token && !this.isTokenExpired()) {
            // Token exists and is valid - restore session
            return this.fetchCurrentUser().pipe(
                tap((user) => {
                    this.stateService.setState({ user, connected: true });
                    this.isAuthenticated$.next(true);
                    this.setupTokenRefresh();
                    this.resetInactivityTimer();
                }),
                catchError((err) => {
                    console.error('Failed to restore session:', err);
                    this.clearAuth();
                    return of(null);
                }),
                finalize(() => {
                    this.userFetchInProgress = false;
                })
            );
        } else {
            // No valid token - clear auth
            this.clearAuth();
            return of(null);
        }
    }

    // Initialize authentication state on app load (deprecated - use checkAndRestoreSession instead)
    private initializeAuth(): void {
        const token = this.getToken();
        if (token && !this.isTokenExpired()) {
            // Token exists and is valid
            this.fetchCurrentUser()
                .pipe(
                    tap((user) => {
                        this.stateService.setState({ user, connected: true });
                        this.isAuthenticated$.next(true);
                        this.setupTokenRefresh();
                        this.resetInactivityTimer();
                    }),
                    catchError((err) => {
                        console.error('Failed to fetch user on init:', err);
                        this.clearAuth();
                        return of(null);
                    }),
                    finalize(() => {
                        this.userFetchInProgress = false;
                    })
                )
                .subscribe();
        } else {
            // No valid token, clear auth
            this.clearAuth();
        }
    }

    // Setup listeners for user activity (mouse, keyboard)
    private setupActivityListeners(): void {
        if (typeof window === 'undefined') return;

        // Listen to mouse movements, clicks, and keyboard events
        const mouseMove$ = fromEvent(document, 'mousemove');
        const mouseClick$ = fromEvent(document, 'click');
        const keyPress$ = fromEvent(document, 'keypress');
        const keyDown$ = fromEvent(document, 'keydown');

        // Merge all activity events and debounce to avoid excessive updates
        merge(mouseMove$, mouseClick$, keyPress$, keyDown$)
            .pipe(debounceTime(1000)) // Only trigger once per second max
            .subscribe(() => {
                if (this.isAuthenticated$.value) {
                    this.onUserActivity();
                }
            });
    }

    // Handle user activity
    private onUserActivity(): void {
        this.lastActivityTime = Date.now();
        this.resetInactivityTimer();
        this.extendTokenExpiry();
    }

    // Reset the inactivity timer
    private resetInactivityTimer(): void {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }

        this.inactivityTimer = setTimeout(() => {
            console.log('Session expired due to inactivity');
            this.logout();
        }, this.INACTIVITY_TIMEOUT);
    }

    // Extend token expiry based on activity
    private extendTokenExpiry(): void {
        const currentExpiry = this.getTokenExpiry();
        if (!currentExpiry) return;

        const currentExpiryTime = new Date(currentExpiry).getTime();
        const now = Date.now();
        const newExpiryTime = now + this.INACTIVITY_TIMEOUT;

        // Only extend if the new expiry is later than current
        if (newExpiryTime > currentExpiryTime) {
            const newExpiryDate = new Date(newExpiryTime);
            localStorage.setItem(this.TOKEN_EXPIRY_KEY, newExpiryDate.toISOString());

            // Restart token refresh timer with new expiry
            this.setupTokenRefresh();
        }
    }

    private fetchCurrentUser(): Observable<UserState> {
        if (this.userFetchInProgress) {
            return of(this.stateService.getInitialUserState());
        }
        this.userFetchInProgress = true;

        const headers = { Authorization: `Bearer ${this.getToken()}` };
        const refreshToken = this.getRefreshToken();

        return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.me, { refreshToken }, { headers }).pipe(
            map((response) => ({
                id: response.user.id,
                email: response.user.email,
                role: response.user.role,
                permissions: response.user.permissions || [],
                token: this.getToken()
            }))
        );
    }

    register(authRequest: AuthRequest): Observable<UserState> {
        return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.register, authRequest).pipe(
            tap((response) => {
                this.storeAuthData(response);
                this.isAuthenticated$.next(true);
                this.resetInactivityTimer();
            }),
            map((response) => this.extractUserState(response)),
            tap((user) => this.stateService.setState({ user, connected: true }))
        );
    }

    login(authRequest: AuthRequest): Observable<UserState> {
        return this.http.post<any>(ENDPOINTS.PERSONNEL.auth.login, authRequest).pipe(
            tap((response) => {
                this.storeAuthData(response);
                this.isAuthenticated$.next(true);
                this.resetInactivityTimer();
            }),
            map((response) => this.extractUserState(response)),
            tap((user) => this.stateService.setState({ user, connected: true }))
        );
    }

    logout() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        this.clearAuth();
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            return throwError(
                () =>
                    ({
                        status: 401,
                        message: 'No refresh token available',
                        error: 'Authentication Error',
                        timestamp: new Date().toISOString(),
                        path: ENDPOINTS.PERSONNEL.auth.refresh
                    }) as Erreur
            );
        }

        return this.http.post(ENDPOINTS.PERSONNEL.auth.refresh, { refreshToken }).pipe(
            tap((response: any) => {
                if (response.token) {
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                }
                if (response.refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
                }
                // Update expiry after refresh
                if (response.expiresIn) {
                    const expiryDate = new Date(Date.now() + response.expiresIn);
                    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString());
                }
            }),
            catchError((error) => {
                this.logout();
                return throwError(() => error);
            })
        );
    }

    private setupTokenRefresh(): void {
        const expiry = this.getTokenExpiry();
        if (!expiry) return;

        const expiryTime = new Date(expiry).getTime();
        const now = Date.now();
        const refreshTime = expiryTime - now - 5 * 60 * 1000; // 5 mins before expiry

        if (refreshTime > 0) {
            this.tokenRefreshTimer$ = timer(refreshTime).pipe(
                switchMap(() => this.refreshToken()),
                shareReplay(1)
            );
            this.tokenRefreshTimer$.subscribe();
        }
    }

    private storeAuthData(response: any): void {
        const { token, refreshToken, expiresIn } = response;

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

        // Set initial expiry to 30 minutes from now
        const expiryDate = new Date(Date.now() + this.INACTIVITY_TIMEOUT);
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    }

    private extractUserState(response: any): UserState {
        return {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            permissions: response.user.permissions || [],
            token: response.token
        };
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    getTokenExpiry(): string | null {
        return localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    }

    isTokenExpired(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return true;
        return new Date(expiry).getTime() <= Date.now();
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticated$.asObservable();
    }

    // Check if user is authenticated (synchronous)
    isAuthenticatedSync(): boolean {
        return this.isAuthenticated$.value;
    }

    clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
        this.isAuthenticated$.next(false);
        this.stateService.setState({ user: null, connected: false });
    }

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
