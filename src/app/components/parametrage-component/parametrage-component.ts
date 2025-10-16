import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { EtablissementComponent } from '../etablissement-component/etablissement-component';
import { VilleComponent } from '../ville/ville-component/ville-component';
import { PersonnelComponent } from '../personnel-component/personnel-component';

@Component({
  selector: 'app-parametrage-component',
  imports: [CommonModule, TabsModule, EtablissementComponent, VilleComponent, PersonnelComponent],
  templateUrl: './parametrage-component.html',
  styleUrl: './parametrage-component.scss'
})
export class ParametrageComponent {

}
