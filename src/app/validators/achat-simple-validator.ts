import { DetAchatSimple } from "@/models/det-achat-simple";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function AchatSimpleValidator(conf: { getListDetAchatSimple: () => DetAchatSimple[] }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);
    const addError = (key: string) => { errors[key] = true; };

    const dateOperation = get('dateOperation')?.value;
    const fournisseurId = get('fournisseurId')?.value;
    const numBlExterne = get('numBlExterne')?.value;

    if (dateOperation === null || dateOperation === undefined || dateOperation === '') {
      addError('dateOperationRequired');
    }

    if (fournisseurId === null || fournisseurId === undefined || fournisseurId === BigInt(0)) {
      addError('fournisseurIdRequired');
    }

    if (numBlExterne === null || numBlExterne === undefined || numBlExterne.trim() === '') {
      addError('numBlExterneRequired');
    }   

    const listDetAchatSimple = conf.getListDetAchatSimple();    
    if(null === listDetAchatSimple || undefined === listDetAchatSimple || listDetAchatSimple.length === 0) {
        addError('listDetAchatSimpleRequired');
    }
    return errors;
  };
}