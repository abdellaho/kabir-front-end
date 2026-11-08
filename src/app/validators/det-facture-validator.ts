import { Stock } from '@/models/stock';
import { getPrixVenteMin, getRemiseMax } from '@/shared/classes/generic-methods';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DetFactureValidator(config: { getStock: () => Stock }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const stock = config.getStock();
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

        // Deliberate deviation from legacy FactureActionBeans.controleRemise (no such
        // guard there): align the invoice dialog with LivraisonActionBeans.controleRemise
        // (L4844-4848) - an untouched price (== pvttc) must not be flagged.
        if (prixVente?.value !== stock.pvttc && prixVente?.value < prixVenteMin) {
            addError('prixVenteMustBeAtLeastEqualPrixVenteMin');
        }

        if (remiseFacture?.value !== 100 && remiseFacture?.value > remiseMax) {
            addError('remiseFactureMustBeAtMostEqualRemiseMax');
        }

        if (qteFacturer?.value === 0) {
            addError('qteFacturerMustBeDifferentFromZero');
        }

        return hasError ? errors : null;
    };
}
