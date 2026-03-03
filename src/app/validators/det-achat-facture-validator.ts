import { Stock } from '@/models/stock';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetAchatFactureValidator(config: { stock: Stock }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let errors: any = {};
        let hasError = false;

        const addError = (key: string) => {
            hasError = true;
            errors[key] = true;
        };

        let qteAcheter = control.get('qteAcheter');

        if (qteAcheter?.value === null || qteAcheter?.value === undefined || qteAcheter?.value === 0) {
            addError('qteAcheterMustBeDifferentThan0');
        }

        return hasError ? errors : null;
    };
}
