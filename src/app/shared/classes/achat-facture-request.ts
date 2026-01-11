import { AchatFacture } from "@/models/achat-facture";
import { DetAchatFacture } from "@/models/det-achat-facture";

export interface AchatFactureRequest {
    achatFacture: AchatFacture;
    detAchatFactures: DetAchatFacture[];
}
