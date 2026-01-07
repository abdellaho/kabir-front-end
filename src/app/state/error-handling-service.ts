// error-handler.service.ts
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { StateService } from './state-service';
import { Erreur } from '@/shared/classes/erreur';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private stateService: StateService) {}

  // Global error handler for uncaught errors
  handleError(error: Error | HttpErrorResponse): void {
    // HTTP errors are handled by the interceptor
    if (error instanceof HttpErrorResponse) {
      return; // Let the interceptor handle it
    }

    // Handle application errors (non-HTTP)
    const appError: Erreur = {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: error.name || 'Application Error',
      path: 'client-side'
    };

    console.error('Application Error:', appError);
    
    this.stateService.setState({
      error: appError.message,
      loading: false,
      timestamp: appError.timestamp,
      path: appError.path
    });
  }

  // Clear error state
  clearError(): void {
    this.stateService.setState({ error: null });
  }
}