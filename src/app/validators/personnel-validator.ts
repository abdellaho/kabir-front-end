import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PersonnelValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const get = (name: string) => control.get(name);

    let tel1 = get('tel1');
    let tel2 = get('tel2');

    if(!tel1 || !tel2) {
        return null;
    }

    if(tel1 && tel2 && tel1?.value !== '' && tel2?.value !== '' && tel1?.value === tel2?.value && tel1?.value !== null && tel2?.value !== null) {
        console.log('tel1', tel1?.value, 'tel2', tel2?.value);
        return { tel1EqualTel2: true };
    } else {
        return null;
    }
}