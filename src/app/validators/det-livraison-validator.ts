import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetLivraisonValidator(config: { stock: Stock }): ValidatorFn {
    const { stock } = config;
    const errors: ValidationErrors = {};
    const addError = (key: string) => { errors[key] = true; };

    return (control: AbstractControl): ValidationErrors | null => {
        let prixVente = control.get('prixVente');
        let remiseLivraison = control.get('remiseLivraison');

        let prixVenteMin: number = getPrixVenteMin(stock);
        let remiseMax: number = getRemiseMax(stock);

        if(prixVente?.value < prixVenteMin) {
            addError("prixVenteMustBeAtLeastEqualPrixVenteMin");
        }

        if(remiseLivraison?.value > remiseMax) {
            addError("remiseLivraisonMustBeAtMostEqualRemiseMax");
        }

        return Object.keys(errors).length ? errors : null;
    }
}

