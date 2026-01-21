import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetFactureValidator(config: { stock: Stock }): ValidatorFn {
    const { stock } = config;

    return (control: AbstractControl): ValidationErrors | null => {
        let errors: any = {};
        let hasError = false;

        const addError = (key: string) => {
            hasError = true;
            errors[key] = true;
        };

        let prixVente = control.get('prixVente');
        let remiseFacture = control.get('remiseFacture');
        let qteFacturer = control.get('qteFacturer');

        let prixVenteMin: number = getPrixVenteMin(stock);
        let remiseMax: number = getRemiseMax(stock);

        if (prixVente?.value < prixVenteMin) {
            addError('prixVenteMustBeAtLeastEqualPrixVenteMin');
        }

        if (remiseFacture?.value > remiseMax) {
            addError('remiseFactureMustBeAtMostEqualRemiseMax');
        }

        if (qteFacturer?.value === 0) {
            addError('qteFacturerMustBeDifferentFromZero');
        }

        return hasError ? errors : null;
    };
}
