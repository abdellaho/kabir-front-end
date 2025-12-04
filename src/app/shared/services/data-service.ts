import { DetLivraison } from "@/models/det-livraison";
import { Fournisseur } from "@/models/fournisseur";
import { Livraison } from "@/models/livraison";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private livraisonData = new Subject<{ livraison: Livraison, detLivraisons: DetLivraison[], listFournisseur: Fournisseur[] }>();
    livraisonData$ = this.livraisonData.asObservable();

    setLivraisonData(data: { livraison: Livraison, detLivraisons: DetLivraison[], listFournisseur: Fournisseur[] }) {
        this.livraisonData.next(data);
    }

    constructor() {}
}