import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function AchatFactureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    let hasError = false;
    const get = (name: string) => control.get(name);
    const addError = (key: string) => { errors[key] = true, hasError = true; };

    const dateFacture = get('dateFacture')?.value;
    const datePaiement = get('datePaiement')?.value;
    const typePaiement = get('typePaiement')?.value;
    const fournisseurId = get('fournisseurId')?.value;
    const numFacture = get('numFacture')?.value;
    const chequeNum = get('chequeNum')?.value;

    if (dateFacture === null || dateFacture === undefined || dateFacture === '') {
      addError('dateFactureRequired');
    }

    if (datePaiement === null || datePaiement === undefined || datePaiement === '') {
      addError('datePaiementRequired');
    }

    if(!hasError) {
        if(datePaiement.getTime() < dateFacture.getTime()) {
            addError('datePaiementBeforeDateFacture');
        }
    }

    if (fournisseurId === null || fournisseurId === undefined || fournisseurId === BigInt(0)) {
      addError('fournisseurIdRequired');
    }

    if (numFacture === null || numFacture === undefined || numFacture.trim() === '') {
      addError('numFactureRequired');
    }

    if(typePaiement === 1 && (chequeNum === null || chequeNum === undefined || chequeNum.trim() === '')) {
      addError('chequeNumRequired');
    }

    /*const listDetAchatFacture = conf.getListDetAchatFacture();    
    if(null === listDetAchatFacture || undefined === listDetAchatFacture || listDetAchatFacture.length === 0) {
        addError('listDetAchatFactureRequired');
    }
    */
    return errors;
  };
}