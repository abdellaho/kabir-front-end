import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { PaysComponent } from '@/components/pays/pays-component/pays-component';
import { VilleComponent } from '@/components/ville/ville-component/ville-component';
import { EtablissementComponent } from '@/components/etablissement-component/etablissement-component';
import { PersonnelComponent } from '@/components/personnel-component/personnel-component';
import { ParametrageComponent } from '@/components/parametrage-component/parametrage-component';
import { AbsenceComponent } from '@/components/absence-component/absence-component';
import { FournisseurComponent } from '@/components/fournisseur-component/fournisseur-component';
import { RepertoireComponent } from '@/components/repertoire-component/repertoire-component';
import { StockComponent } from '@/components/stock-component/stock-component';
import { VoitureComponent } from '@/components/voiture-component/voiture-component';
import { PrimeComponent } from '@/components/prime-component/prime-component';
import { AcceuilComponent } from '@/components/acceuil-component/acceuil-component';
import { LivraisonUpdateComponent } from '@/components/livraison-component/livraison-update-component/livraison-update-component';
import { LivraisonViewComponent } from '@/components/livraison-component/livraison-view-component/livraison-view-component';
import { StockDepotComponent } from '@/components/stock-depot-component/stock-depot-component';
import { AchatSimpleComponent } from '@/components/achat-simple-component/achat-simple-component';
import { LoginComponent } from '@/components/login-component/login-component';
import { AuthGuard } from '@/state/auth-guard';
import { AchatFactureComponent } from '@/components/achat-facture-component/achat-facture-component';
import { BonSortieComponent } from '@/components/bon-sortie-component/bon-sortie-component';
import { FactureViewComponent } from '@/components/facture-component/facture-view-component/facture-view-component';
import { FactureUpdateComponent } from '@/components/facture-component/facture-update-component/facture-update-component';
import { CaisseComponent } from '@/components/caisse-component/caisse-component';
import { ChequeComponent } from '@/components/cheque-component/cheque-component';
import { AchatEtrangerComponent } from '@/components/achat-etranger-component/achat-etranger-component';
import { CaisseGeneralComponent } from '@/components/caisse-general-component/caisse-general-component';
import { CompteCourantComponent } from '@/components/compte-courant-component/compte-courant-component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: AcceuilComponent, canActivate: [AuthGuard] },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'parametrage', component: ParametrageComponent, canActivate: [AuthGuard] },
            { path: 'pays', component: PaysComponent, canActivate: [AuthGuard] },
            { path: 'ville', component: VilleComponent, canActivate: [AuthGuard] },
            { path: 'absence', component: AbsenceComponent, canActivate: [AuthGuard] },
            { path: 'fournisseur', component: FournisseurComponent, canActivate: [AuthGuard] },
            { path: 'repertoire', component: RepertoireComponent, canActivate: [AuthGuard] },
            { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
            { path: 'voiture', component: VoitureComponent, canActivate: [AuthGuard] },
            { path: 'etablissement', component: EtablissementComponent, canActivate: [AuthGuard] },
            { path: 'prime', component: PrimeComponent, canActivate: [AuthGuard] },
            { path: 'personnel', component: PersonnelComponent, canActivate: [AuthGuard] },
            { path: 'livraison', component: LivraisonViewComponent, canActivate: [AuthGuard] },
            { path: 'livraison-update', component: LivraisonUpdateComponent, canActivate: [AuthGuard] },
            { path: 'facture', component: FactureViewComponent, canActivate: [AuthGuard] },
            { path: 'facture-update', component: FactureUpdateComponent, canActivate: [AuthGuard] },
            { path: 'stock-depot', component: StockDepotComponent, canActivate: [AuthGuard] },
            { path: 'achat-simple', component: AchatSimpleComponent, canActivate: [AuthGuard] },
            { path: 'achat-facture', component: AchatFactureComponent, canActivate: [AuthGuard] },
            { path: 'bon-sortie', component: BonSortieComponent, canActivate: [AuthGuard] },
            { path: 'achat-etranger', component: AchatEtrangerComponent, canActivate: [AuthGuard] },
            { path: 'caisse', component: CaisseGeneralComponent, canActivate: [AuthGuard] },
            { path: 'compte-courant', component: CompteCourantComponent, canActivate: [AuthGuard] },
            { path: 'cheque', component: ChequeComponent, canActivate: [AuthGuard] },
            { path: 'documentation', component: Documentation },
            { path: 'login', component: LoginComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
