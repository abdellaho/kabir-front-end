// http-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Erreur } from '@/shared/classes/erreur';
import { StateService } from '@/state/state-service';

interface BackendError {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const appError = parseBackendError(error);
      
      // Update global state
      stateService.setState({
        error: appError.message,
        loading: false,
        timestamp: appError.timestamp,
        path: appError.path
      });

      // Log for debugging (remove in production)
      console.error('HTTP Error:', {
        status: appError.status,
        message: appError.message,
        path: appError.path,
        timestamp: appError.timestamp
      });

      // Special handling for 401 (authentication errors)
      if (error.status === 401) {
        // Optional: Redirect to login or clear auth tokens
        // const router = inject(Router);
        // router.navigate(['/login']);
      }

      return throwError(() => appError);
    })
  );
};

function parseBackendError(error: HttpErrorResponse): Erreur {
  let appError: Erreur = {
    status: error.status,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    error: 'Something went wrong',
    path: error.url || 'Unknown'
  };

  // Parse backend error response
  if (error.error && typeof error.error === 'object') {
    const backendError = error.error as BackendError;
    
    appError = {
      status: backendError.status || error.status,
      message: backendError.message || getDefaultMessage(error.status),
      timestamp: backendError.timestamp || new Date().toISOString(),
      error: backendError.error || error.statusText,
      path: backendError.path || error.url || 'Unknown'
    };
  } else if (typeof error.error === 'string') {
    appError.message = error.error;
  } else {
    appError.message = getDefaultMessage(error.status);
  }

  return appError;
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication failed. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
    case 502:
    case 503:
      return 'Server error. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}