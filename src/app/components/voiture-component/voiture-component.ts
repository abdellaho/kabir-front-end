import { initObjectVoiture, Voiture } from '@/models/voiture';
import { VoitureService } from '@/services/voiture/voiture-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-voiture-component',
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
    InputTextModule
  ],
  templateUrl: './voiture-component.html',
  styleUrl: './voiture-component.scss'
})
export class VoitureComponent implements OnInit {

  //NumVoiture + kmMax

  listVoiture: Voiture[] = [];
  voiture: Voiture = initObjectVoiture();
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private voitureService: VoitureService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getAllAbsence();
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
      kmMax: [0, [Validators.required, Validators.minLength(1)]],
      numVoiture: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  getAllAbsence(): void {
    this.voitureService.getAll().subscribe({
      next: (data: Voiture[]) => {
        this.listVoiture = data;
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

  viderAjouter() {
    this.openCloseDialogAjouter(true);
    this.submitted = false;
    this.voiture = initObjectVoiture();
    this.initFormGroup();
  }

  recupperer(operation: number, voitureEdit: Voiture) {
    if(voitureEdit && voitureEdit.id) {
        this.voiture = voitureEdit;
        if(operation === 1) {
          this.formGroup.patchValue({
            kmMax: this.voiture.kmMax,
            numVoiture: this.voiture.numVoiture,
          });

          this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(voiture: Voiture, list: Voiture[], operationType: OperationType, id?: bigint): Voiture[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, voiture ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === voiture.id);
        if(index > -1) {
            list[index] = voiture;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listVoiture) {
        this.listVoiture = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, voiture: Voiture): Voiture {
    voiture.kmMax = formGroup.get('kmMax')?.value;
    voiture.numVoiture = formGroup.get('numVoiture')?.value;

    return voiture;
  }

  async checkIfPaysExists(voiture: Voiture): Promise<boolean> {
    try {
      const existsObservable = this.voitureService.exist(voiture).pipe(
        catchError(error => {
          console.error('Error in voiture existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if voiture exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let voitureEdit: Voiture = { ...this.voiture };
    this.mapFormGroupToObject(this.formGroup, voitureEdit);
    let absenceSearch: Voiture = { ...this.voiture };
    let trvErreur = await this.checkIfPaysExists(absenceSearch);
    
    if(!trvErreur) {
      this.mapFormGroupToObject(this.formGroup, this.voiture);
      this.submitted = true;
      
      if(this.voiture.id) {
        this.voitureService.update(this.voiture.id, this.voiture).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listVoiture = this.updateList(data, this.listVoiture, OperationType.MODIFY);
              this.openCloseDialogAjouter(false);
          }, error: (err) => {
              console.log(err);
              this.loadingService.hide();
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.voitureService.create(this.voiture).subscribe({
            next: (data: Voiture) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listVoiture = this.updateList(data, this.listVoiture, OperationType.ADD);
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le voiture existe deja" });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.voiture && this.voiture.id) {
      this.loadingService.show();
      let id = this.voiture.id;
      this.voitureService.delete(this.voiture.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listVoiture = this.updateList(initObjectVoiture(), this.listVoiture, OperationType.DELETE, id);
            this.voiture = initObjectVoiture() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
        }, complete: () => {
          this.loadingService.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
    }

    this.openCloseDialogSupprimer(false);
  }

}
