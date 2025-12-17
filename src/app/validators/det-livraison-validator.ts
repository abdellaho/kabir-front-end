import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetLivraisonValidator(config: { stock: Stock }): ValidatorFn {
    const { stock } = config;

    return (control: AbstractControl): ValidationErrors | null => {
        let errors: any = {};
        let hasError = false;

        const addError = (key: string) => {
            hasError = true;
            errors[key] = true;
        };

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

        return hasError ? errors : null;
    }
}

