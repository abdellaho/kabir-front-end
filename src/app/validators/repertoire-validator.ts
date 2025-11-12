import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const RepertoireValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const get = (name: string) => control.get(name);

    let tel1 = get('tel1');
    let tel2 = get('tel2');
    let tel3 = get('tel3');
    let errors: any = {};
    let hasError = false;

    const addError = (key: string) => {
        hasError = true;
        errors[key] = true;
    };

    if((!tel1 && !tel2) || (!tel1 && !tel3) || (!tel3 && !tel2)) {
        addError('');
    }

    if((tel1 && tel2) || (tel1 && tel3) || (tel2 && tel3)) {
        if(tel1?.value !== '' && tel2?.value !== '' && tel1?.value === tel2?.value) {
            addError('tel1EqualTel2');
        }
        if(tel1?.value !== '' && tel3?.value !== '' && tel1?.value === tel3?.value) {
            addError('tel1EqualTel3');
        }
        if(tel3?.value !== '' && tel2?.value !== '' && tel3?.value === tel2?.value) {
            addError('tel2EqualTel3');
        }
    }

    return hasError ? errors : null;
}