import { Component } from '@angular/core';

@Component({
    selector: 'app-achat-etranger-component',
    imports: [],
    templateUrl: './achat-etranger-component.html',
    styleUrl: './achat-etranger-component.scss'
})
export class AchatEtrangerComponent {
    //Import dans l'application precedente
    //Affichage --> fournisseur + Num Facture + Date Facture + montant facture + montant payer + taux + transport international + la douane +  magazinage + total
    //Tableau -->
    //Ajouter --> fournisseur     + Num Facture             + Date Facture             + montant facture (text comme 135 usd)
    //            Date viremeent1 + mnt virement 1          + Date virement 2          + mnt virement 2
    //            monatnt payé    + transport international + la douane                + magazinage
    //            combo produit   + total payé
    // tableau produits ---> Designation + stock facture + stock depot + qte achat + prix Achat + button supprimer
    // fenetre Ajouter produit --> Designation + Qtock Depot + Qte Fact + Qte Achat + Prix Achat
}
