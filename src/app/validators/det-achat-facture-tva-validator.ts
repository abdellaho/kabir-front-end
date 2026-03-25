import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const DetAchatFactureTVAValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);
    const addError = (key: string) => {
        errors[key] = true;
    };

    const mntHT = get('mntHT');
    //const mntTVA = get('mntTVA');
    //const taux = get('taux');

    if (!mntHT /* || !mntTVA || !taux*/) {
        return null;
    }

    const mntHTValue = mntHT.value;
    //const mntTVAValue = mntTVA.value;
    //const tauxValue = taux.value;

    if (mntHTValue === null || mntHTValue === undefined /*&& (mntTVAValue === null || mntTVAValue === undefined) && (tauxValue === null || tauxValue === undefined)*/) {
        addError('detAchatFactureTVAValidator');
    } else {
        if (mntHTValue === 0 /*&& mntTVAValue === 0 && tauxValue === 0*/) {
            addError('detAchatFactureTVAValidator');
        }
    }

    return errors;
};
