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
        //const numAchat = get('numAchat')?.value;
        const numCheque = get('numCheque')?.value;

        if (dateAF === null || dateAF === undefined || dateAF === '') {
            console.log('Error dateAF : ', dateAF)
            addError('dateAFRequired');
        }

        if (numeroFacExterne === null || numeroFacExterne === undefined || numeroFacExterne.trim() === '') {
            console.log('Error numeroFacExterne : ', numeroFacExterne)
            addError('numeroFacExterneRequired');
        }

        if (dateReglement === null || dateReglement === undefined || dateReglement === '') {
            console.log('Error dateReglement : ', dateReglement)
            addError('dateReglementRequired');
        }

        if (!hasError) {
            if (dateReglement.getTime() < dateAF.getTime()) {
                console.log('Error dateReglementBeforeDateAF : ', dateReglement)
                addError('dateReglementBeforeDateAF');
            }
        }

        if (fournisseurId === null || fournisseurId === undefined || fournisseurId === BigInt(0)) {
            console.log('Error fournisseurId : ', fournisseurId)
            addError('fournisseurIdRequired');
        }

        /*if (numAchat === null || numAchat === undefined || numAchat.trim() === '') {
            console.log('Error numAchat : ', numAchat)
            addError('numAchatRequired');
        }*/

        if (typeReglment === 1 && (numCheque === null || numCheque === undefined || numCheque.trim() === '')) {
            console.log('Error numCheque : ', numCheque)
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
