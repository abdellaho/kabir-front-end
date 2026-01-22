import { Component } from '@angular/core';

@Component({
    selector: 'app-caisse-component',
    imports: [],
    templateUrl: './caisse-component.html',
    styleUrl: './caisse-component.scss'
})
export class CaisseComponent {
    //Comme l'ancienne application
    //Tableau --> dateOperation + montant + type(Versement + retrait) + Actions
    //Ajouter --> type(Versement + retrait) + dateOperation + montant
}
