import { AbstractControl, ValidationErrors } from '@angular/forms';

export function NegativeValidator(control: AbstractControl): ValidationErrors | null {
  let value: number = control.value;
  
  // Treat null/undefined as 0
  if (value === null || value === undefined) {
    value = 0;
  }
  
  // Check if negative (invalid)
  if (typeof value === 'number' && value < 0) {
    return { negative: true };  // Custom error key
  }
  
  return null;  // Valid
}