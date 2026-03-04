import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CompteCourantComponent } from '../compte-courant-component/compte-courant-component';
import { ChequeComponent } from '../cheque-component/cheque-component';
import { ComptaComponent } from '../compta-component/compta-component';
import { CaisseGeneralComponent } from '../caisse-general-component/caisse-general-component';

@Component({
    selector: 'app-comptabilite-component',
    imports: [CommonModule, TabsModule, CompteCourantComponent, ChequeComponent, ComptaComponent, CaisseGeneralComponent],
    templateUrl: './comptabilite-component.html',
    styleUrl: './comptabilite-component.scss'
})
export class ComptabiliteComponent {
    value: number = 0;
    loadedTabs: Set<number> = new Set([0]);
    msg = APP_MESSAGES;

    onTabChange(event: any) {
        this.value = event;
        this.loadedTabs.add(this.value);
    }
}
