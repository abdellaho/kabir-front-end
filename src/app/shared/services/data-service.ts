import { DetLivraison } from "@/models/det-livraison";
import { Fournisseur } from "@/models/fournisseur";
import { Livraison } from "@/models/livraison";
import { Personnel } from "@/models/personnel";
import { Stock } from "@/models/stock";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private livraisonData = new Subject<{ 
      livraison: Livraison, 
      detLivraisons: DetLivraison[], 
      listFournisseur: Fournisseur[],
      listStock: Stock[],
      listPersonnel: Personnel[]
    }>();
    livraisonData$ = this.livraisonData.asObservable();

    setLivraisonData(data: { 
      livraison: Livraison, 
      detLivraisons: DetLivraison[], 
      listFournisseur: Fournisseur[],
      listStock: Stock[],
      listPersonnel: Personnel[]
    }) {
        this.livraisonData.next(data);
    }

    constructor() {}
}