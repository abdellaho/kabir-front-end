import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { initLivraisonData, LivraisonData } from "../classes/livraison-data";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSubject = new BehaviorSubject<LivraisonData>(initLivraisonData());

  // Expose the data as a public Observable (cannot call .next() from components)
  public currentData$: Observable<LivraisonData> = this.dataSubject.asObservable();

  setLivraisonData(data: LivraisonData) {
    this.dataSubject.next(data);
  }

  constructor() {}
}