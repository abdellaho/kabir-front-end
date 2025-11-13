import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const StockValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  // Helper to get form controls safely
  const get = (name: string) => control.get(name);
  let pattc = get('pattc');
  let prixCommercial = get('prixCommercial');
  let pvttc = get('pvttc');

  // List ranges for Remise/Qte
  const remiseLevels = [
    { r: get('prixVentMin1'), q: get('qtePVMin1'), key: 1 },
    { r: get('prixVentMin2'), q: get('qtePVMin2'), key: 2 },
    { r: get('prixVentMin3'), q: get('qtePVMin3'), key: 3 },
    { r: get('prixVentMin4'), q: get('qtePVMin4'), key: 4 }
  ];

  // List ranges for Montant/Prime
  const primeLevels = [
    { m: get('montant1'), p: get('prime1'), key: 1 },
    { m: get('montant2'), p: get('prime2'), key: 2 },
    { m: get('montant3'), p: get('prime3'), key: 3 }
  ];

  // If missing fields, skip validator
  if (remiseLevels.some(l => !l.r || !l.q) || primeLevels.some(l => !l.m || !l.p)) {
    return null;
  }

  let errors: any = {};
  let hasError = false;

  /* ------------------ Helpers ------------------ */

  const addError = (key: string) => {
    hasError = true;
    errors[key] = true;
  };

  if(pattc && pvttc && pattc.value !== null && pvttc.value !== null && pattc.value !== 0 && pvttc.value !== 0) {
    if(pattc.value >= pvttc.value) {
      addError('pvttcMustBeGreatThanPattc');
    }
  }

  if(pattc && prixCommercial && pattc.value !== null && prixCommercial.value !== null && pattc.value !== 0 && prixCommercial.value !== 0) {
    if(pattc.value >= prixCommercial.value) {
      addError('prixCommercialMustBeGreatThanPattc');
    }
  }

  const validatePair = (valueA: number, valueB: number, keyA: string, keyB: string) => {
    if (valueA > 0 && (valueB === null || valueB === 0)) addError(`${keyB}Required`);
    else if (valueB > 0 && (valueA === null || valueA === 0)) addError(`${keyA}Required`);
  };

  const validateAscending = (curr: number, next: number, keyCurr: string, keyNext: string) => {
    if (curr > 0 && next > 0 && curr >= next) {
      addError(`${keyNext}MustBeGreaterThan${keyCurr}`);
    }
  };

  const validateDescending = (curr: number, next: number, keyCurr: string, keyNext: string) => {
    if (curr > 0 && next > 0 && curr <= next) {
      addError(`${keyCurr}MustBeGreaterThan${keyNext}`);
    }
  };

  const validateWithPrixVenteTTC= (curr: number, keyCurr: string) => {
    if (curr > 0  && curr && pattc && curr < pattc?.value) {
      addError(`${keyCurr}MustBeGreaterThanPATTC`);
    }
  };

  /* ------------------ Validate Remise/Qte ------------------ */

  remiseLevels.forEach((lvl, i) => {
    validatePair(lvl.r!.value, lvl.q!.value, `prixVentMin${lvl.key}`, `qtePVMin${lvl.key}`);
    validateWithPrixVenteTTC(lvl.r!.value, `prixVentMin${lvl.key}`);

    if (i < remiseLevels.length - 1) {
      const next = remiseLevels[i + 1];
      validateDescending(lvl.r!.value, next.r!.value, `prixVentMin${lvl.key}`, `prixVentMin${next.key}`);
      validateAscending(lvl.q!.value, next.q!.value, `qtePVMin${lvl.key}`, `qtePVMin${next.key}`);
    }
  });

  /* ------------------ Validate Montant/Prime ------------------ */

  primeLevels.forEach((lvl, i) => {
    validatePair(lvl.m!.value, lvl.p!.value, `montant${lvl.key}`, `prime${lvl.key}`);

    if (i < primeLevels.length - 1) {
      const next = primeLevels[i + 1];
      validateAscending(lvl.m!.value, next.m!.value, `montant${lvl.key}`, `montant${next.key}`);
    }
  });

  return hasError ? errors : null;
};
