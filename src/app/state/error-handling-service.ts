// error-handler.service.ts
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StateService } from './state-service';

export interface AppError {
  message: string;
  code?: string;
  timestamp: Date;
  userMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private stateService: StateService) {}

  handleError(error: Error | HttpErrorResponse): void {
    const appError = this.processError(error);
    
    // Log error securely (never log sensitive data)
    this.logError(appError);
    
    // Update state with user-friendly error
    this.stateService.setState({ 
      error: appError.userMessage,
      loading: false 
    });
  }

  // Process different error types
  private processError(error: Error | HttpErrorResponse): AppError {
    let appError: AppError = {
      message: 'An unexpected error occurred',
      timestamp: new Date(),
      userMessage: 'Something went wrong. Please try again.'
    };

    if (error instanceof HttpErrorResponse) {
      appError = this.handleHttpError(error);
    } else {
      appError.message = error.message;
    }

    return appError;
  }

  // Handle HTTP errors
  private handleHttpError(error: HttpErrorResponse): AppError {
    const appError: AppError = {
      message: error.message,
      code: error.status.toString(),
      timestamp: new Date(),
      userMessage: 'Something went wrong. Please try again.'
    };

    switch (error.status) {
      case 400:
        appError.userMessage = 'Invalid request. Please check your input.';
        break;
      case 401:
        appError.userMessage = 'Your session has expired. Please log in again.';
        break;
      case 403:
        appError.userMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        appError.userMessage = 'The requested resource was not found.';
        break;
      case 429:
        appError.userMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
      case 502:
      case 503:
        appError.userMessage = 'Server error. Please try again later.';
        break;
      default:
        appError.userMessage = 'An error occurred. Please try again.';
    }

    return appError;
  }

  // Secure error logging (never log sensitive data)
  private logError(error: AppError): void {
    const sanitizedError = {
      code: error.code,
      timestamp: error.timestamp,
      // Never log the actual error message in production as it might contain sensitive data
      type: error.code ? 'HTTP Error' : 'Application Error'
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