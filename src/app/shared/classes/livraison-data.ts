import { initObjectLivraison, Livraison } from "@/models/livraison";
import { DetLivraison } from "@/models/det-livraison";
import { Fournisseur } from "@/models/fournisseur";
import { Stock } from "@/models/stock";
import { Personnel } from "@/models/personnel";

export interface LivraisonData {
    livraison: Livraison;
    detLivraisons: DetLivraison[];
    listFournisseur: Fournisseur[];
    listStock: Stock[];
    listPersonnel: Personnel[];
}

export function initLivraisonData(): LivraisonData {
    return {
        livraison: initObjectLivraison(),
        detLivraisons: [],
        listFournisseur: [],
        listStock: [],
        listPersonnel: []
    };
}
