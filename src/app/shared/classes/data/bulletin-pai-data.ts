import { BulletinPai, initObjectBulletinPai } from '@/models/bulletin-pai';
import { DetBulletinPai } from '@/models/det-bulletin-pai';
import { DetBulletinLivraison } from '@/models/det-bulletin-livraison';
import { Personnel } from '@/models/personnel';
import { Stock } from '@/models/stock';

export interface BulletinPaiData {
    bulletinPai: BulletinPai;
    detBulletinPais: DetBulletinPai[];
    detBulletinPaisSansMontant: DetBulletinPai[];
    detBulletinLivraisons: DetBulletinLivraison[];
    listPersonnel: Personnel[];
    listStock: Stock[];
}

export function initBulletinPaiData(): BulletinPaiData {
    return {
        bulletinPai: initObjectBulletinPai(),
        detBulletinPais: [],
        detBulletinPaisSansMontant: [],
        detBulletinLivraisons: [],
        listPersonnel: [],
        listStock: []
    };
}
