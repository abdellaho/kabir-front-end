import { DetLivraison } from '@/models/det-livraison';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function LivraisonValidator(conf: { getListDetLivraison: () => DetLivraison[] }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    const get = (name: string) => control.get(name);
    const getValue = (name: string) => get(name)?.value;
    const hasValue = (value: any) => value !== null && value !== undefined && value !== '' && value !== 0;
    const addError = (key: string) => { errors[key] = true; };

    // Call the getter function to get the current list
    const listDetLivraison = conf.getListDetLivraison();
    let listDetIsExist: boolean = false;
    let sumDetLivraison: number = 0;
    if(listDetLivraison.length === 0) {
      addError('listDetLivraisonRequired');
    } else {
      listDetIsExist = true;
      sumDetLivraison = listDetLivraison.reduce((sum, detLivraison) => sum + Number(detLivraison.montantProduit), 0);
    }

    // Validate required fields
    if (!hasValue(getValue('personnelId'))) addError('personnelIdRequired');
    if (!hasValue(getValue('repertoireId'))) addError('repertoireIdRequired');

    // Payment validation config
    const reglements = [
      { mnt: 'mntReglement', date: 'dateReglement', numCheque: 'numCheque', typeReglment: 'typeReglment', suffix: '' },
      { mnt: 'mntReglement2', date: 'dateReglement2', numCheque: 'numCheque2', typeReglment: 'typeReglment2', suffix: '2' },
      { mnt: 'mntReglement3', date: 'dateReglement3', numCheque: 'numCheque3', typeReglment: 'typeReglment3', suffix: '3' },
      { mnt: 'mntReglement4', date: 'dateReglement4', numCheque: 'numCheque4', typeReglment: 'typeReglment4', suffix: '4' },
    ];

    const mantantBL: number = getValue('mantantBL');
    const dateBl = getValue('dateBl');
    const hasMantantBL = mantantBL > 0;
    let totalMntReglement: number = 0;

    // Validate each payment
    reglements.forEach((reg, index) => {
      const dateValue = getValue(reg.date);
      const mntValue = getValue(reg.mnt) || 0;
      const typeReglementValue = getValue(reg.typeReglment) || 0;
      const numChequeValue = getValue(reg.numCheque) || '';
      const prevReg = index > 0 ? reglements[index - 1] : null;
      const nextReg = index < 3 ? reglements[index + 1] : null;

      // Special case for first payment: requires dateBl
      if (index === 0) {
        if (dateValue && dateBl) {
          totalMntReglement += mntValue;

          const dateReglement1 = new Date(dateValue);
          const dateBlFormat = new Date(dateBl);
          dateReglement1.setHours(0, 0, 0, 0);
          dateBlFormat.setHours(0, 0, 0, 0);
          
          if (dateReglement1 < dateBlFormat) {
            addError('dateReglementMustEqualOrAfterDateBl');
          }
          validateAmount(reg.suffix, mntValue, hasMantantBL, addError);
          validateNumCheque(reg.suffix, typeReglementValue, numChequeValue, addError);
        }
        return;
      }

      // For payments 2-4
      if (dateValue) {
        totalMntReglement += mntValue;

        // Check date is after previous payment date
        const prevDateValue = getValue(prevReg!.date);
        const currentDate = new Date(dateValue);
        const previousDate = new Date(prevDateValue);
        previousDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        if (prevDateValue && (currentDate <= previousDate)) {
          addError(`dateReglement${reg.suffix}MustBeAfterDateReglement${prevReg!.suffix}`);
        }

        validateAmount(reg.suffix, mntValue, hasMantantBL, addError);
        validateNumCheque(reg.suffix, typeReglementValue, numChequeValue, addError);
      } else if (nextReg && getValue(nextReg.date)) {
        // Next payment filled without this one
        addError(`dateReglement${reg.suffix}MustBeFilledFirst`);
      }

      if(!dateValue) {
        if(Number(mntValue) !== 0) {
          addError(`dateReglement${reg.suffix}IsMandatory`);
        }
      }
    });

    if(listDetIsExist) {
      if (Number(totalMntReglement) !== Number(sumDetLivraison)) {
        addError('totalMntReglementNotEqualMantantBL');
      }
    } else {
      // Validate total matches BL amount
      if (Number(totalMntReglement) !== Number(mantantBL)) {
        addError('totalMntReglementNotEqualMantantBL');
      }
    }

    return Object.keys(errors).length ? errors : null;
  };
}

function validateAmount(
  suffix: string,
  amount: number,
  hasMantantBL: boolean,
  addError: (key: string) => void
): void {
  const fieldName = suffix ? `mntReglement${suffix}` : 'mntReglement';
  
  if (hasMantantBL) {
    if (amount <= 0) {
      addError(`${fieldName}MustBeBiggerThanZero`);
    }
  } else if (amount < 0) {
    addError(`${fieldName}MustBeAtLeastEqualZero`);
  }
}

function validateNumCheque(
  suffix: string,
  typeReglement: number,
  numCheque: string, 
  addError: (key: string) => void
): void {
  const fieldName = suffix ? `numCheque${suffix}` : 'numCheque';
  
  if (typeReglement === 1 && (!numCheque || numCheque.trim() === '')) {
    addError(`${fieldName}Required`);
  }
}