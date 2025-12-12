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

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: AcceuilComponent },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'parametrage', component: ParametrageComponent },
            { path: 'pays', component: PaysComponent },
            { path: 'ville', component: VilleComponent },
            { path: 'absence', component: AbsenceComponent },
            { path: 'fournisseur', component: FournisseurComponent },
            { path: 'repertoire', component: RepertoireComponent },
            { path: 'stock', component: StockComponent },
            { path: 'voiture', component: VoitureComponent },
            { path: 'etablissement', component: EtablissementComponent },
            { path: 'prime', component: PrimeComponent },
            { path: 'personnel', component: PersonnelComponent },
            { path: 'livraison', component: LivraisonViewComponent },
            { path: 'livraison-update', component: LivraisonUpdateComponent },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
