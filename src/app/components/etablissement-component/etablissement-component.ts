import { Etablissement, initObjectEtablissement } from '@/models/etablissement';
import { Ville } from '@/models/ville';
import { EtablissementService } from '@/services/etablissement/etablissement-service';
import { VilleService } from '@/services/ville/ville-service';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-etablissement-component',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './etablissement-component.html',
  styleUrl: './etablissement-component.scss'
})
export class EtablissementComponent implements OnInit {

  listVille: Ville[] = [];
  etablissement: Etablissement = initObjectEtablissement();
  submitted: boolean = false;
  loading: boolean = true;
  formGroup!: FormGroup;

  constructor(
    private villeService: VilleService,
    private etablissementService: EtablissementService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.getAllVilles();
    this.getAll();
    this.initFormGroup();
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      adresse: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      capitale: [0, [Validators.required, Validators.min(0)]],
      cheminBD: [''],
      cnss: [''],
      email: [''],
      fax: [''],
      fromMail: [''],
      nom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      hostmail: [''],
      ife: [''],
      ice: [''],
      lundi: [false],
      mardi: [false],
      mercredi: [false],
      jeudi: [false],
      vendredi: [false],
      samedi: [false],
      dimanche: [false],
      userMail: [''],
      paswordMail: [''],
      paswordMailFake: [''],
      lienDbDump: [''],
      lienBackupDB: [''],
      pourcentageLiv: [0, [Validators.required, Validators.min(0)]],
      patente: [''],
      raisonSocial: [''],
      siteweb: [''],
      gsm: [''],
      userMailFake: [''],
      port: [''],
      hostMail: [''],
      numJour: [0, [Validators.required, Validators.min(0)]],
      typeExec: [0, [Validators.required, Validators.min(0)]],
      villeId: [0, [Validators.required, Validators.min(0)]],
    });
  }

  getAllVilles(): void {
    this.villeService.getVilles().subscribe({
      next: (data: Ville[]) => {
        this.listVille = data;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getAll(): void {
    this.etablissementService.getAll().subscribe({
      next: (data: Etablissement[]) => {
        let list: Etablissement[] = data;
        if(list && list.length > 0) {
          this.etablissement = list[0];
        }
        this.loading = false;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  mapFormGroupToObject(formGroup: FormGroup, etablissement: Etablissement): Etablissement {
    etablissement.adresse = formGroup.get('adresse')?.value;
    etablissement.capitale = formGroup.get('capitale')?.value;
    etablissement.cheminBD = formGroup.get('cheminBD')?.value;
    etablissement.cnss = formGroup.get('cnss')?.value;
    etablissement.email = formGroup.get('email')?.value;
    etablissement.fax = formGroup.get('fax')?.value;
    etablissement.fromMail = formGroup.get('fromMail')?.value;
    etablissement.hostMail = formGroup.get('hostMail')?.value;
    etablissement.ife = formGroup.get('ife')?.value;
    etablissement.ice = formGroup.get('ice')?.value;
    etablissement.lundi = formGroup.get('lundi')?.value;
    etablissement.mardi = formGroup.get('mardi')?.value;
    etablissement.mercredi = formGroup.get('mercredi')?.value;
    etablissement.jeudi = formGroup.get('jeudi')?.value;
    etablissement.vendredi = formGroup.get('vendredi')?.value;
    etablissement.samedi = formGroup.get('samedi')?.value;
    etablissement.dimanche = formGroup.get('dimanche')?.value;
    etablissement.nom = formGroup.get('nom')?.value;
    etablissement.userMail = formGroup.get('userMail')?.value;
    etablissement.paswordMail = formGroup.get('paswordMail')?.value;
    etablissement.paswordMailFake = formGroup.get('paswordMailFake')?.value;
    etablissement.patente = formGroup.get('patente')?.value;
    etablissement.port = formGroup.get('port')?.value;
    etablissement.pourcentageLiv = formGroup.get('pourcentageLiv')?.value;
    etablissement.raisonSocial = formGroup.get('raisonSocial')?.value;
    etablissement.siteweb = formGroup.get('siteweb')?.value;
    etablissement.tel = formGroup.get('tel')?.value;
    etablissement.userMail = formGroup.get('userMail')?.value;
    etablissement.gsm = formGroup.get('gsm')?.value;
    etablissement.lienDbDump = formGroup.get('lienDbDump')?.value;
    etablissement.lienBackupDB = formGroup.get('lienBackupDB')?.value; 
    etablissement.numJour = formGroup.get('numJour')?.value;
    etablissement.typeExec = formGroup.get('typeExec')?.value;
    etablissement.villeId = formGroup.get('villeId')?.value;

    return etablissement;
  }

  async miseAjour(): Promise<void> {
    let trvErreur = false;
    if(!trvErreur) {
      this.etablissement = this.mapFormGroupToObject(this.formGroup, this.etablissement);
      this.loadingService.show();
      this.submitted = true;

      if(this.etablissement.id) {
        this.etablissementService.update(this.etablissement.id, this.etablissement).subscribe({
          next: (data) => {
            this.etablissement = data;
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
          }, error: (err) => {
              console.log(err);
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.etablissementService.create(this.etablissement).subscribe({
            next: (data: Etablissement) => {
              this.etablissement = data;
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
            }, error: (err) => {
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    }
  }

}
