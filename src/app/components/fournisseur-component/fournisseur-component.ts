import { Component } from '@angular/core';

@Component({
  selector: 'app-fournisseur-component',
  imports: [],
  templateUrl: './fournisseur-component.html',
  styleUrl: './fournisseur-component.scss'
})
export class FournisseurComponent {

  //Buttons ---> Ajouter + Rechercher + Actualiser + Archiver + Corbeille
  //Tableau ---> Designation + Type + Tel1 + Tel2 
  //Ajouter ---> Designation* + Type + Tel1 + Tel2  + ICE

  types: any = [
    { key: 'Marchandises', value: 0}, 
    { key: 'Services', value: 1}, 
    { key: 'Douanes', value: 2}, 
    { key: 'Carburant', value: 3},
    { key: 'Fourniture', value: 4},
  ]

}
