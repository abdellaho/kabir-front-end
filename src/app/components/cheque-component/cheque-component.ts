import { Component } from '@angular/core';

@Component({
    selector: 'app-cheque-component',
    imports: [],
    templateUrl: './cheque-component.html',
    styleUrl: './cheque-component.scss'
})
export class ChequeComponent {
    // Comme l'ancien sauf supprimer type dans l'ajout
    //Tableau --> repertoire + numero + montant + date cheque + etat cheque + footer(montantStck + montantCredit + montantCheque)
    //Ajouter -->  repertoire + date cheque + montant + numero + etat cheque
}
