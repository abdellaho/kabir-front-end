import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AchatFactureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const errors: ValidationErrors = {};
        let hasError = false;
        const get = (name: string) => control.get(name);
        const addError = (key: string) => {
            ((errors[key] = true), (hasError = true));
        };

        const dateAF = get('dateAF')?.value;
        const numeroFacExterne = get('numeroFacExterne')?.value;
        const dateReglement = get('dateReglement')?.value;
        const typeReglment = get('typeReglment')?.value;
        const fournisseurId = get('fournisseurId')?.value;
        const numAchat = get('numAchat')?.value;
        const numCheque = get('numCheque')?.value;

        if (dateAF === null || dateAF === undefined || dateAF === '') {
            addError('dateAFRequired');
        }

        if (numeroFacExterne === null || numeroFacExterne === undefined || numeroFacExterne.trim() === '') {
            addError('numeroFacExterneRequired');
        }

        if (dateReglement === null || dateReglement === undefined || dateReglement === '') {
            addError('dateReglementRequired');
        }

        if (!hasError) {
            if (dateReglement.getTime() < dateAF.getTime()) {
                addError('dateReglementBeforeDateAF');
            }
        }

        if (fournisseurId === null || fournisseurId === undefined || fournisseurId === BigInt(0)) {
            addError('fournisseurIdRequired');
        }

        if (numAchat === null || numAchat === undefined || numAchat.trim() === '') {
            addError('numAchatRequired');
        }

        if (typeReglment === 1 && (numCheque === null || numCheque === undefined || numCheque.trim() === '')) {
            addError('numChequeRequired');
        }

        /*const listDetAchatFacture = conf.getListDetAchatFacture();    
    if(null === listDetAchatFacture || undefined === listDetAchatFacture || listDetAchatFacture.length === 0) {
        addError('listDetAchatFactureRequired');
    }
    */
        return errors;
    };
}
