import { Facture } from "@/models/facture";
import { DetFacture } from "@/models/det-facture";


export interface FactureRequest {
    facture: Facture;
    detFactures: DetFacture[];
}