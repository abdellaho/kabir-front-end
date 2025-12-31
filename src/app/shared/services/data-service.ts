import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { initLivraisonData, LivraisonData } from "../classes/livraison-data";
import { FactureData, initFactureData } from "../classes/facture-data";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSubject = new BehaviorSubject<LivraisonData>(initLivraisonData());
  private factureSubject = new BehaviorSubject<FactureData>(initFactureData());

  // Expose the data as a public Observable (cannot call .next() from components)
  public currentData$: Observable<LivraisonData> = this.dataSubject.asObservable();
  public currentFacture$: Observable<FactureData> = this.factureSubject.asObservable();

  setLivraisonData(data: LivraisonData) {
    this.dataSubject.next(data);
  }

  setFactureData(data: FactureData) {
    this.factureSubject.next(data);
  }

  constructor() {}
}