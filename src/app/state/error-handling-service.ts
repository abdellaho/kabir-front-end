// error-handler.service.ts
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StateService } from './state-service';
import { Erreur } from '@/shared/classes/erreur';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private stateService: StateService) {}

  handleError(error: Error | HttpErrorResponse): void {
    const appError = this.processError(error);

    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.handleAuthError(error);
      return;
    }
    
    // Log error securely (never log sensitive data)
    this.logError(appError);
    
    // Update state with user-friendly error
    this.stateService.setState({ 
      error: appError.message,
      loading: false,
      timestamp: appError.timestamp,
      path: appError.path
    });
  }

  handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Authentication failed'; // Default fallback

    if (error.error instanceof ErrorEvent) {
      // Client-side error (e.g., network)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error: Parse the JSON body from your handler
      if (error.error && typeof error.error === 'object') {
        const serverError = error.error as { message?: string; error?: string; status?: number };
        errorMessage = serverError.message || serverError.error || `Server error (Status: ${error.status})`;
        
        // Optional: Log full details for debugging
        console.error('Full server error:', {
          status: error.status,
          message: error.error.message,
          path: error.url,
          timestamp: error.error.timestamp
        });
      } else {
        // Plain string or unexpected format
        errorMessage = error.message || `Server error (Status: ${error.status})`;
      }
    }

    // Set error in state for UI (e.g., show in component via stateService.select('error'))
    this.stateService.setState({ error: errorMessage });

    // Optional: Show user-friendly toast/alert (if you have a NotificationService)
    // this.notificationService.showError(errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  // Process different error types
  private processError(error: Error | HttpErrorResponse): Erreur {
    let appError: Erreur = {
      status: error instanceof HttpErrorResponse ? error.status : 401,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Something went wrong. Please try again.',
      path: error instanceof HttpErrorResponse ? error.url?.toString() || 'Unknown' : 'Unknown'
    }

    if (error instanceof HttpErrorResponse) {
      appError = this.handleHttpError(error);
    } else {
      appError.message = error.message;
    }

    return appError;
  }

  // Handle HTTP errors
  private handleHttpError(error: HttpErrorResponse): Erreur {
    const appError: Erreur = {
      message: error.message,
      status: error.status,
      timestamp: new Date().toISOString(),
      error: 'Something went wrong. Please try again.',
      path: error.url?.toString() || 'Unknown'
    };

    switch (error.status) {
      case 400:
        appError.message = 'Invalid request. Please check your input.';
        break;
      case 401:
        appError.message = 'Your session has expired. Please log in again.';
        break;
      case 403:
        appError.message = 'You do not have permission to perform this action.';
        break;
      case 404:
        appError.message = 'The requested resource was not found.';
        break;
      case 429:
        appError.message = 'Too many requests. Please try again later.';
        break;
      case 500:
      case 502:
      case 503:
        appError.message = 'Server error. Please try again later.';
        break;
      default:
        appError.message = 'An error occurred. Please try again.';
    }

    return appError;
  }

  // Secure error logging (never log sensitive data)
  private logError(error: Erreur): void {
    const sanitizedError = {
      status: error.status,
      timestamp: error.timestamp,
      // Never log the actual error message in production as it might contain sensitive data
      type: error.status ? 'HTTP Error' : 'Application Error'
    };

    console.error('Error occurred:', sanitizedError);
    
    // In production, send to logging service
    // this.loggingService.logError(sanitizedError);
  }

  // Create observable error handler
  handleObservableError<T>(error: any): Observable<T> {
    this.handleError(error);
    return throwError(() => error);
  }

  // Clear error state
  clearError(): void {
    this.stateService.setState({ error: null });
  }
}