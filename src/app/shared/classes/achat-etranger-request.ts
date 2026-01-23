import { AchatEtranger } from '@/models/achat-etranger';
import { DetAchatEtranger } from '@/models/det-achat-etranger';

export interface AchatEtrangerRequest {
    achatEtranger: AchatEtranger;
    detAchatEtrangers: DetAchatEtranger[];
}
