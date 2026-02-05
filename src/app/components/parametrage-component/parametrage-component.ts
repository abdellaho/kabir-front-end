import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { EtablissementComponent } from '../etablissement-component/etablissement-component';
import { VilleComponent } from '../ville/ville-component/ville-component';
import { PersonnelComponent } from '../personnel-component/personnel-component';
import { FournisseurComponent } from '@/components/fournisseur-component/fournisseur-component';
import { VoitureComponent } from '@/components/voiture-component/voiture-component';
import { PrimeComponent } from '@/components/prime-component/prime-component';
import { APP_MESSAGES } from '@/shared/classes/app-messages';

@Component({
    selector: 'app-parametrage-component',
    imports: [CommonModule, TabsModule, EtablissementComponent, VilleComponent, PersonnelComponent, FournisseurComponent, VoitureComponent, PrimeComponent],
    templateUrl: './parametrage-component.html',
    styleUrl: './parametrage-component.scss'
})
export class ParametrageComponent {
    value: number = 0;
    loadedTabs: Set<number> = new Set([0]);
    msg = APP_MESSAGES;

    onTabChange(event: any) {
        this.value = event;
        this.loadedTabs.add(this.value);
    }
}
