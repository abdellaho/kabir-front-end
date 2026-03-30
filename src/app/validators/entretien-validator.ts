import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const EntretienValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);

    const addError = (key: string) => {
        errors[key] = true;
    };

    const voitureId = get('voitureId');
    const voitureKmMax = get('voitureKmMax');
    const dateEntretien = get('dateEntretien');
    const kmDetecte = get('kmDetecte');

    if (!voitureId || !voitureKmMax || !dateEntretien || !kmDetecte) {
        return null;
    }

    const vId: number = voitureId.value;
    const vKmMax: number = voitureKmMax.value;
    const dEntretien: Date = dateEntretien.value;
    const kDetecte: number = kmDetecte.value;

    if(vId === null || vId === undefined || vId === 0){
        addError('voitureIdRequired');
    }

    if(dEntretien === null || dEntretien === undefined){
        addError('dateEntretienRequired');
    }

    if(kDetecte === null || kDetecte === undefined || kDetecte === 0){
        addError('kmDetecteRequired');
    }

    return Object.keys(errors).length ? errors : null;
};