import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DetStockDepot } from "@/models/det-stock-depot";

export function StockDepotValidator(conf: { getListDetStockDepot: () => DetStockDepot[] }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);
    const addError = (key: string) => { errors[key] = true; };

    const dateOperation = get('dateOperation')?.value;

    if (dateOperation === null || dateOperation === undefined || dateOperation === '') {
      addError('dateOperationRequired');
    }

    const listDetStockDepot = conf.getListDetStockDepot();    
    if(null === listDetStockDepot || undefined === listDetStockDepot || listDetStockDepot.length === 0) {
        addError('listDetStockDepotRequired');
    }
    return errors;
  };
}