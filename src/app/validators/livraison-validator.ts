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
    if(listDetLivraison.length === 0) {
      addError('listDetLivraisonRequired');
    }

    // Validate required fields
    if (!hasValue(getValue('personnelId'))) addError('personnelIdRequired');
    if (!hasValue(getValue('fournisseurId'))) addError('fournisseurIdRequired');

    // Payment validation config
    const reglements = [
      { mnt: 'mntReglement', date: 'dateReglement', suffix: '' },
      { mnt: 'mntReglement2', date: 'dateReglement2', suffix: '2' },
      { mnt: 'mntReglement3', date: 'dateReglement3', suffix: '3' },
      { mnt: 'mntReglement4', date: 'dateReglement4', suffix: '4' },
    ];

    const mantantBL = getValue('mantantBL');
    const dateBl = getValue('dateBl');
    const hasMantantBL = mantantBL !== '' && mantantBL > 0;
    let totalMntReglement = 0;

    // Validate each payment
    reglements.forEach((reg, index) => {
      const dateValue = getValue(reg.date);
      const mntValue = getValue(reg.mnt) || 0;
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
      } else if (nextReg && getValue(nextReg.date)) {
        // Next payment filled without this one
        addError(`dateReglement${reg.suffix}MustBeFilledFirst`);
      }
    });

    // Validate total matches BL amount
    if (totalMntReglement !== mantantBL) {
      addError('totalMntReglementNotEqualMantantBL');
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