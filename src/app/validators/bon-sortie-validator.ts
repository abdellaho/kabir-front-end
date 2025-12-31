import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DetailBonSortie } from "@/models/detail-bon-sortie";

export function BonSortieValidator(conf: { getListDetailBonSortie: () => DetailBonSortie[] }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);
    const addError = (key: string) => { errors[key] = true; };

    const dateOperation = get('dateOperation')?.value;

    if (dateOperation === null || dateOperation === undefined || dateOperation === '') {
      addError('dateOperationRequired');
    }

    const listDetailBonSortie = conf.getListDetailBonSortie();    
    if(null === listDetailBonSortie || undefined === listDetailBonSortie || listDetailBonSortie.length === 0) {
        addError('listDetailBonSortieRequired');
    }
    return errors;
  };
}