import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetAchatFactureValidator(config: { stock: Stock }): ValidatorFn {
    const { stock } = config;

    return (control: AbstractControl): ValidationErrors | null => {
        let errors: any = {};
        let hasError = false;

        const addError = (key: string) => {
            hasError = true;
            errors[key] = true;
        };

        let qteacheter = control.get('qteacheter');
        //let unitegratuit = control.get('unitegratuit');

        if(qteacheter?.value === 0) {
            addError("qteacheterMustBeDifferentThan0");
        }

        return hasError ? errors : null;
    }
}

