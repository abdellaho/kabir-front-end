import { Personnel } from '@/models/personnel';
import { initObjectRepertoire, Repertoire } from '@/models/repertoire';
import { Ville } from '@/models/ville';
import { TypeRepertoirePipe } from '@/pipes/type-repertoire-pipe';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { RepertoireService } from '@/services/repertoire/repertoire-service';
import { VilleService } from '@/services/ville/ville-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypeRepertoire } from '@/shared/enums/type-repertoire';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { MessageModule } from 'primeng/message';
import { RepertoireValidator } from '@/validators/repertoire-validator';
import { arrayToMap, getElementFromMap } from '@/shared/classes/generic-methods';

@Component({
  selector: 'app-repertoire-component',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    TypeRepertoirePipe
  ],
  templateUrl: './repertoire-component.html',
  styleUrl: './repertoire-component.scss'
})
export class RepertoireComponent {

  types: any = [
    { key: 'Pharmacie', value: 0},
    { key: 'Revendeur', value: 1},
    { key: 'Transport', value: 2},
  ]

  //Buttons ---> Ajouter + Rexchercher + Actualiser + Archiver + Corbeille
  //Tableau ---> Type(Pharmacie + Revendeur + Transport)* + Designation* + Ville* + ICE + Tel 1 + Tel2 + Tel 3 + Commercial + Commentaire + nbrBl
  //Ajouter ---> Type* + Designation* + Ville* + Tel 1 + Tel2 + Tel 3 + ICE + Commentaire(Observation) + Commercial + Plafond

  typeOfList: number = 0;
  typeRepertoire: { label: string, value: number }[] = filteredTypeRepertoire;
  listVille: Ville[] = [];
  listPersonnel: Personnel[] = [];
  listRepertoire: Repertoire[] = [];
  repertoire: Repertoire = initObjectRepertoire();
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  mapOfVilles: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  dialogArchiver: boolean = false;
  dialogCorbeille: boolean = false;
  dialogAnnulerArchiver: boolean = false;
  dialogAnnulerCorbeille: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;
  msg = APP_MESSAGES;

  constructor(
    private villeService: VilleService,
    private personnelService: PersonnelService,
    private repertoireService: RepertoireService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.typeOfList = 0;
    this.search();
    this.getAllVille();
    this.getAllPersonnel();
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
      typeRepertoire: [0, [Validators.required, Validators.min(1)]],
      designation: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      villeId: [0, [Validators.required, Validators.min(1)]],
      tel1: ['', [Validators.maxLength(10)]],
      tel2: ['', [Validators.maxLength(10)]],
      tel3: ['', [Validators.maxLength(10)]],
      ice: ['', [Validators.maxLength(15)]],
      observation: ['', [Validators.maxLength(250)]],
      personnelId: [0, [Validators.required, Validators.min(1)]],
      plafond: [null],
    }, { validators: [RepertoireValidator]});
  }

  search() {
    if(this.typeOfList === 1) {
      this.getAllRepertoireArchive();
    } else if(this.typeOfList === 2) {
      this.getAllRepertoireCorbeille();
    } else {
      this.getAllRepertoire();
    }
  }

  archiveListe(): void {
    this.typeOfList = 1;
    this.search();
  }

  bloqueListe(): void {
    this.typeOfList = 2;
    this.search();
  }

  listOfAll(): void {
    this.typeOfList = 0;
    this.search();
  }

  initSearch(archiver: boolean, bloquer: boolean): Repertoire {
    let search: Repertoire = initObjectRepertoire();

    search.archiver = archiver;
    search.bloquer = bloquer;

    return search;
  }

  getAllRepertoire(): void {
    let search: Repertoire = this.initSearch(false, false);
    this.repertoireService.search(search).subscribe({
      next: (data: Repertoire[]) => {
        this.listRepertoire = data;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getAllRepertoireArchive(): void {
    let search: Repertoire = this.initSearch(true, false);

    this.repertoireService.search(search).subscribe({
      next: (data: Repertoire[]) => {
        this.listRepertoire = data;
      }, error: (error: any) => {
        console.error(error);
      }, complete: () => {
        this.loadingService.hide();
      }
    });
  }

  getAllRepertoireCorbeille(): void {
    let stockSearch: Repertoire = this.initSearch(false, true);

    this.repertoireService.search(stockSearch).subscribe({
      next: (data: Repertoire[]) => {
        this.listRepertoire = data;
      }, error: (error: any) => {
        console.error(error);
      }, complete: () => {
        this.loadingService.hide();
      }
    });
  }

  getAllPersonnel(): void {
    this.personnelService.getAll().subscribe({
      next: (data: Personnel[]) => {
        this.listPersonnel = data;
          this.mapOfPersonnels = arrayToMap(data, 'id', ['designation'], ['']);
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getAllVille(): void {
    this.villeService.getVilles().subscribe({
      next: (data: Ville[]) => {
        this.listVille = data;
          this.mapOfVilles = arrayToMap(data, 'id', ['nomVille'], ['']);
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  openCloseDialogAjouter(openClose: boolean): void {
    this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
    this.dialogSupprimer = openClose;
  }

  openCloseDialogArchiver(openClose: boolean): void {
    this.dialogArchiver = openClose;
  }

  openCloseDialogCorbeille(openClose: boolean): void {
    this.dialogCorbeille = openClose;
  }

  openCloseDialogAnnulerArchiver(openClose: boolean): void {
    this.dialogAnnulerArchiver = openClose;
  }

  openCloseDialogAnnulerCorbeille(openClose: boolean): void {
    this.dialogAnnulerCorbeille = openClose;
  }

  getNomVille(id: number) {
      return getElementFromMap(this.mapOfVilles, id);
  }

  getPersonnelName(id: number) {
      return getElementFromMap(this.mapOfPersonnels, id);
  }

  viderAjouter() {
    this.openCloseDialogAjouter(true);
    this.submitted = false;
    this.repertoire = initObjectRepertoire();
    this.initFormGroup();
  }

  recupperer(operation: number, repertoireEdit: Repertoire) {
    if(repertoireEdit && repertoireEdit.id) {
      this.repertoire = repertoireEdit;
      if(operation === 1) {
        this.formGroup.patchValue({
          typeRepertoire: this.repertoire.typeRepertoire,
          designation: this.repertoire.designation,
          villeId: this.repertoire.villeId,
          tel1: this.repertoire.tel1,
          tel2: this.repertoire.tel2,
          tel3: this.repertoire.tel3,
          ice: this.repertoire.ice,
          observation: this.repertoire.observation,
          personnelId: this.repertoire.personnelId,
          plafond: this.repertoire.plafond !== 0 ? this.repertoire.plafond : null,
        });

        this.openCloseDialogAjouter(true);
      } else if(operation === 2) {
          this.openCloseDialogSupprimer(true);
      } else if(operation === 3) {
        this.openCloseDialogArchiver(true);
      } else if(operation === 4) {
          this.openCloseDialogCorbeille(true);
      } else if(operation === 5) {
        this.openCloseDialogAnnulerArchiver(true);
      } else if(operation === 6) {
        this.openCloseDialogAnnulerCorbeille(true);
      }
    } else {
        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
    }
  }

  updateList(repertoire: Repertoire, list: Repertoire[], operationType: OperationType, id?: bigint): Repertoire[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, repertoire ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === repertoire.id);
        if(index > -1) {
            list[index] = repertoire;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listRepertoire) {
        this.listRepertoire = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, repertoire: Repertoire): Repertoire {
    repertoire.typeRepertoire = formGroup.get('typeRepertoire')?.value;
    repertoire.designation = formGroup.get('designation')?.value;
    repertoire.villeId = formGroup.get('villeId')?.value;
    repertoire.tel1 = formGroup.get('tel1')?.value;
    repertoire.tel2 = formGroup.get('tel2')?.value;
    repertoire.tel3 = formGroup.get('tel3')?.value;
    repertoire.ice = formGroup.get('ice')?.value;
    repertoire.observation = formGroup.get('observation')?.value;
    repertoire.personnelId = formGroup.get('personnelId')?.value;
    repertoire.plafond = formGroup.get('plafond')?.value ?? 0;

    return repertoire;
  }

  async checkIfPaysExists(repertoire: Repertoire): Promise<boolean> {
    try {
      const existsObservable = this.repertoireService.exist(repertoire).pipe(
        catchError(error => {
          console.error('Error in repertoire existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if repertoire exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let repertoireEdit: Repertoire = { ...this.repertoire };
    this.mapFormGroupToObject(this.formGroup, repertoireEdit);
    let absenceSearch: Repertoire = { ...this.repertoire };
    let trvErreur = await this.checkIfPaysExists(absenceSearch);

    if(!trvErreur) {
      this.mapFormGroupToObject(this.formGroup, this.repertoire);
      this.submitted = true;

      if(this.repertoire.id) {
        this.repertoireService.update(this.repertoire.id, this.repertoire).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });
              this.checkIfListIsNull();
              this.listRepertoire = this.updateList(data, this.listRepertoire, OperationType.MODIFY);
              this.openCloseDialogAjouter(false);
          }, error: (err) => {
              console.log(err);
              this.loadingService.hide();
              this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.repertoireService.create(this.repertoire).subscribe({
            next: (data: Repertoire) => {
                this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });
                this.checkIfListIsNull();
                this.listRepertoire = this.updateList(data, this.listRepertoire, OperationType.ADD);
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.repertoire.label} ${this.msg.messages.messageExistDeja}` });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.repertoire && this.repertoire.id) {
      this.loadingService.show();
      let id = this.repertoire.id;
      this.repertoireService.delete(this.repertoire.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageDeleteSuccess });
            this.checkIfListIsNull();
            this.listRepertoire = this.updateList(initObjectRepertoire(), this.listRepertoire, OperationType.DELETE, id);
            this.repertoire = initObjectRepertoire() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
        }, complete: () => {
          this.loadingService.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
    }

    this.openCloseDialogSupprimer(false);
  }

  archiver(archiver: boolean): void {
    if(this.repertoire && this.repertoire.id) {
      this.loadingService.show();
      let id = this.repertoire.id;
      this.repertoire.archiver = archiver;

      this.repertoireService.update(this.repertoire.id, this.repertoire).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageSuccess });
            this.checkIfListIsNull();
            this.listRepertoire = this.updateList(initObjectRepertoire(), this.listRepertoire, OperationType.DELETE, id);
            this.repertoire = initObjectRepertoire() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
        }, complete: () => {
          this.loadingService.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
    }

    if(archiver) {
      this.openCloseDialogArchiver(false);
    } else {
      this.openCloseDialogAnnulerArchiver(false);
    }
  }

  corbeille(corbeille: boolean): void {
    if(this.repertoire && this.repertoire.id) {
      this.loadingService.show();
      let id = this.repertoire.id;
      this.repertoire.bloquer = corbeille;

      this.repertoireService.update(this.repertoire.id, this.repertoire).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageSuccess });
            this.checkIfListIsNull();
            this.listRepertoire = this.updateList(initObjectRepertoire(), this.listRepertoire, OperationType.DELETE, id);
            this.repertoire = initObjectRepertoire() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
        }, complete: () => {
          this.loadingService.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
    }

    if(corbeille) {
      this.openCloseDialogCorbeille(false);
    } else {
      this.openCloseDialogAnnulerCorbeille(false);
    }
  }
}
