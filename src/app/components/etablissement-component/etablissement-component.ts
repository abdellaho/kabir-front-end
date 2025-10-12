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
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from 'primeng/radiobutton';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from "primeng/datepicker";

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
    CheckboxModule,
    RadioButtonModule,
    FluidModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    DatePickerModule
],
  templateUrl: './etablissement-component.html',
  styleUrl: './etablissement-component.scss'
})
export class EtablissementComponent implements OnInit {

  listVille: Ville[] = [];
  typeExecutions: {label: string, value: number}[] = [{label: 'Chaque Jour', value: 0}, {label: 'Chaque Semaine', value: 1}, {label: 'Chaque Mois', value: 2}]; 
  etablissement: Etablissement = initObjectEtablissement();
  days: number[] = [];
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
      email: [''],
      nom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tel1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tel2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tel3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      hostmail: [''],
      rc: [''],
      ife: [''],
      ice: [''],
      lundi: [false],
      mardi: [false],
      mercredi: [false],
      jeudi: [false],
      vendredi: [false],
      samedi: [false],
      dimanche: [false],
      paswordMail: [''],
      lienDbDump: [''],
      lienBackupDB: [''],
      cheminBD: [''],
      pourcentageLiv: [0, [Validators.required, Validators.min(0)]],
      patente: [''],
      siteweb: [''],
      port: [''],
      hostMail: [''],
      numJour: [1, [Validators.required, Validators.min(0)]],
      typeExec: [0, [Validators.required, Validators.min(0)]],
      dateTime: [new Date()]
    });
  }

  onChangeTypeExecution(event: any) {
    console.log(this.formGroup.get('typeExec')?.value);
    if(this.formGroup.get('typeExec')?.value === "1" || this.formGroup.get('typeExec')?.value === "2") {
      if(this.formGroup.get('typeExec')?.value === "1") {
        this.days = [1, 2, 3, 4, 5, 6, 7];
      } else {
        this.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      }

      console.log(this.days);
      this.formGroup.get('numJour')?.setValue(1);
    }
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

          this.formGroup.patchValue(this.etablissement);
        }
        this.loading = false;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  mapFormGroupToObject(formGroup: FormGroup, etablissement: Etablissement): Etablissement {
    etablissement.adresse = formGroup.get('adresse')?.value;
    etablissement.cheminBD = formGroup.get('cheminBD')?.value;
    etablissement.email = formGroup.get('email')?.value;
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
    etablissement.paswordMail = formGroup.get('paswordMail')?.value;
    etablissement.patente = formGroup.get('patente')?.value;
    etablissement.port = formGroup.get('port')?.value;
    etablissement.pourcentageLiv = formGroup.get('pourcentageLiv')?.value;
    etablissement.siteweb = formGroup.get('siteweb')?.value;
    etablissement.tel1 = formGroup.get('tel1')?.value;
    etablissement.tel2 = formGroup.get('tel2')?.value;
    etablissement.tel3 = formGroup.get('tel3')?.value;
    etablissement.lienDbDump = formGroup.get('lienDbDump')?.value;
    etablissement.lienBackupDB = formGroup.get('lienBackupDB')?.value; 
    etablissement.numJour = formGroup.get('numJour')?.value;
    etablissement.typeExec = formGroup.get('typeExec')?.value;
    etablissement.dateTime = formGroup.get('dateTime')?.value;

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
