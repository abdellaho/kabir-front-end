import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const AbsencelValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const get = (name: string) => control.get(name);

    const matin = get('matin');
    const apresMidi = get('apresMidi');

    if (!matin || !apresMidi) {
        return null;
    }

    const m = !!matin.value;
    const a = !!apresMidi.value;

    return m || a ? null : { matinOrApresMidiRequired: true };
};