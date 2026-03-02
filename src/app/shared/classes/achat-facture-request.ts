import { AchatFacture } from '@/models/achat-facture';
import { DetAchatFacture } from '@/models/det-achat-facture';
import { DetAchatFactureTVA } from '@/models/det-achat-facture-tva';

export interface AchatFactureRequest {
    achatFacture: AchatFacture;
    detAchatFactures: DetAchatFacture[];
    detAchatFactureTVA: DetAchatFactureTVA[];
}
