import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetLivraisonValidator(config: { getStock: () => Stock }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const stock = config.getStock();
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

        // Legacy parity (LivraisonActionBeans.controleRemise): the price rule only
        // runs when the user actually changed the price away from the stock's pvttc.
        if(prixVente?.value !== stock.pvttc && prixVente?.value < prixVenteMin) {
            addError("prixVenteMustBeAtLeastEqualPrixVenteMin");
        }

        if(remiseLivraison?.value !== 100 && remiseLivraison?.value > remiseMax) {
            addError("remiseLivraisonMustBeAtMostEqualRemiseMax");
        }

        return hasError ? errors : null;
    }
}

