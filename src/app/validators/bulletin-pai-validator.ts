import { DetBulletinPai } from '@/models/det-bulletin-pai';
import { DetBulletinLivraison } from '@/models/det-bulletin-livraison';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function BulletinPaiValidator(conf: { getListDetBulletinPai: () => DetBulletinPai[]; getListDetBulletinLivraison: () => DetBulletinLivraison[] }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const errors: ValidationErrors = {};
        const get = (name: string) => control.get(name);
        const addError = (key: string) => {
            errors[key] = true;
        };

        const dateDebut = get('dateDebut')?.value;
        const dateFin = get('dateFin')?.value;
        const personnelId = get('personnelId')?.value;

        if (dateDebut === null || dateDebut === undefined || dateDebut === '') {
            addError('dateDebutRequired');
        }

        if (dateFin === null || dateFin === undefined || dateFin === '') {
            addError('dateFinRequired');
        }

        if (personnelId === null || personnelId === undefined || personnelId === '') {
            addError('personnelIdRequired');
        }

        if (dateDebut && dateFin) {
            const localDateDebut = new Date(dateDebut);
            const localDateFin = new Date(dateFin);
            const lastDayOfMonth = new Date(localDateFin.getFullYear(), localDateFin.getMonth() + 1, 0).getDate();
            if (localDateDebut.getMonth() != localDateFin.getMonth() || localDateDebut.getFullYear() != localDateFin.getFullYear() || localDateDebut.getDate() != 1 || localDateFin.getDate() != lastDayOfMonth) {
                addError('dateDebutMustBeLessThanDateFin');
            }
        }

        const listDetailBulletinPai = conf.getListDetBulletinPai();
        if (null === listDetailBulletinPai || undefined === listDetailBulletinPai || listDetailBulletinPai.length === 0) {
            addError('listDetailBulletinPaiRequired');
        }

        const listDetailBulletinLivraison = conf.getListDetBulletinLivraison();
        if (null === listDetailBulletinLivraison || undefined === listDetailBulletinLivraison || listDetailBulletinLivraison.length === 0) {
            addError('listDetailBulletinLivraisonRequired');
        }

        return errors;
    };
}
