import { Component } from '@angular/core';

@Component({
  selector: 'app-repertoire-component',
  imports: [],
  templateUrl: './repertoire-component.html',
  styleUrl: './repertoire-component.scss'
})
export class RepertoireComponent {

  //Buttons ---> Ajouter + Rexchercher + Actualiser + Archiver + Corbeille
  //Tableau ---> Type(Pharmacie + Revendeur + Transport)* + Designation* + Ville* + ICE + Tel 1 + Tel2 + Tel 3 + Commercial + Commentaire + nbrBl 
  //Ajouter ---> Type* + Designation* + Ville* + Tel 1 + Tel2 + Tel 3 + ICE + Commentaire(Observation) + Commercial + Plafond
}
