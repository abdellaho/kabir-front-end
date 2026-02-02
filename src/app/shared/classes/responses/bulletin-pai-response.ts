import { BulletinPai } from '@/models/bulletin-pai';
import { DetBulletinLivraison } from '@/models/det-bulletin-livraison';
import { DetBulletinPai } from '@/models/det-bulletin-pai';

export interface BulletinPaiResponse {
    bulletinPai: BulletinPai;
    detBulletinPais: DetBulletinPai[];
    detBulletinPaisSansMontant: DetBulletinPai[];
    detBulletinLivraisons: DetBulletinLivraison[];
}
