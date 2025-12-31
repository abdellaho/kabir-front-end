import { Facture, initObjectFacture } from "@/models/facture";
import { DetFacture } from "@/models/det-facture";
import { Repertoire } from "@/models/repertoire";
import { Stock } from "@/models/stock";
import { Personnel } from "@/models/personnel";

export interface FactureData {
    facture: Facture;
    detFactures: DetFacture[];
    listRepertoire: Repertoire[];
    listStock: Stock[];
    listPersonnel: Personnel[];
}

export function initFactureData(): FactureData {
    return {
        facture: initObjectFacture(),
        detFactures: [],
        listRepertoire: [],
        listStock: [],
        listPersonnel: []
    };
}