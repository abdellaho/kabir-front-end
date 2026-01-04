// sanitization.service.ts
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {
  constructor(private sanitizer: DomSanitizer) {}

  // Sanitize HTML content
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) || '';
  }

  // Sanitize URL
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.sanitize(4, url) || '';
  }

  // Sanitize resource URL
  sanitizeResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.sanitize(5, url) || '';
  }

  // Remove dangerous characters from input
  cleanInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Validate and sanitize email
  sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = this.cleanInput(email);
    return emailRegex.test(cleaned) ? cleaned : '';
  }

  // Sanitize numeric input
  sanitizeNumber(value: any): number | null {
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : null;
  }

  // Sanitize observable streams
  sanitizeStream<T>(stream: Observable<T>, sanitizeFn: (value: T) => T): Observable<T> {
    return stream.pipe(
      map(value => sanitizeFn(value))
    );
  }

  // Validate against SQL injection patterns
  validateSqlInput(input: string): boolean {
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)|(--)|(;)/gi;
    return !sqlPattern.test(input);
  }

  // Validate against XSS patterns
  validateXssInput(input: string): boolean {
    const xssPattern = /<script|<iframe|javascript:|on\w+\s*=/gi;
    return !xssPattern.test(input);
  }

  // Comprehensive input validation
  validateInput(input: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateSqlInput(input)) {
      errors.push('Input contains potential SQL injection patterns');
    }

    if (!this.validateXssInput(input)) {
      errors.push('Input contains potential XSS patterns');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}