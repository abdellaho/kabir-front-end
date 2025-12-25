import { initObjectLivraison, Livraison } from "@/models/livraison";
import { DetLivraison } from "@/models/det-livraison";
import { Stock } from "@/models/stock";
import { Personnel } from "@/models/personnel";
import { Repertoire } from "@/models/repertoire";

export interface LivraisonData {
    livraison: Livraison;
    detLivraisons: DetLivraison[];
    listRepertoire: Repertoire[];
    listStock: Stock[];
    listPersonnel: Personnel[];
}

export function initLivraisonData(): LivraisonData {
    return {
        livraison: initObjectLivraison(),
        detLivraisons: [],
        listRepertoire: [],
        listStock: [],
        listPersonnel: []
    };
}
