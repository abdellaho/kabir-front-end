import { Absence, initObjectAbsence } from '@/models/absence';
import { Personnel } from '@/models/personnel';
import { AbsenceService } from '@/services/absence/absence-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-absence-component',
  imports: [],
  templateUrl: './absence-component.html',
  styleUrl: './absence-component.scss'
})
export class AbsenceComponent implements OnInit {
  //Buttons ---> Ajouter + Rechercher + Actualiser + Consulter
  //Tableau ---> Date + Personnel + Matin + Soir
  //Ajouter ---> Date + Personnel + Matin + Soir

  listPersonnel: Personnel[] = [];
  listAbsence: Absence[] = [];
  absence: Absence = initObjectAbsence();
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private personnelService: PersonnelService,
    private absenceService: AbsenceService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getAllAbsence();
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
      personnelId: [0, [Validators.required, Validators.min(1)]],
      dateAbsence: [new Date(), Validators.required],
      matin: [false],
      apresMidi: [false]
    });
  }

  getAllAbsence(): void {
    this.absenceService.getAll().subscribe({
      next: (data: Absence[]) => {
        this.listAbsence = data;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getAllPersonnel(): void {
    this.personnelService.getAll().subscribe({
      next: (data: Personnel[]) => {
        this.listPersonnel = data;
      },
      error: (error: any) => {
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
    this.absence = initObjectAbsence();
    this.initFormGroup();
  }

  recupperer(operation: number, paysEdit: Absence) {
    if(paysEdit && paysEdit.id) {
        this.absence = paysEdit;
        if(operation === 1) {
          this.formGroup.patchValue({
            personnelId: this.absence.personnelId,
            dateAbsence: new Date(this.absence.dateAbsence) ?? new Date(),
            matin: this.absence.matin,
            apresMidi: this.absence.apresMidi,
          });

          this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(absence: Absence, list: Absence[], operationType: OperationType, id?: bigint): Absence[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, absence ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === absence.id);
        if(index > -1) {
            list[index] = absence;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listAbsence) {
        this.listAbsence = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, absence: Absence): Absence {
    absence.dateAbsence = formGroup.get('dateAbsence')?.value;
    absence.personnelId = formGroup.get('dateAbsence')?.value;
    absence.matin = formGroup.get('matin')?.value;
    absence.apresMidi = formGroup.get('apresMidi')?.value;

    return absence;
  }

  async checkIfPaysExists(absence: Absence): Promise<boolean> {
    try {
      const existsObservable = this.absenceService.exist(absence).pipe(
        catchError(error => {
          console.error('Error in absence existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if absence exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let paysEdit: Absence = { ...this.absence };
    this.mapFormGroupToObject(this.formGroup, paysEdit);
    let absenceSearch: Absence = { ...this.absence };
    let trvErreur = await this.checkIfPaysExists(absenceSearch);
    
    if(!trvErreur) {
      this.mapFormGroupToObject(this.formGroup, this.absence);
      this.submitted = true;
      
      if(this.absence.id) {
        this.absenceService.update(this.absence.id, this.absence).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listAbsence = this.updateList(data, this.listAbsence, OperationType.MODIFY);
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
        this.absenceService.create(this.absence).subscribe({
            next: (data: Absence) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listAbsence = this.updateList(data, this.listAbsence, OperationType.ADD);
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
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le absence existe deja" });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.absence && this.absence.id) {
      this.loadingService.show();
      let id = this.absence.id;
      this.absenceService.delete(this.absence.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listAbsence = this.updateList(initObjectAbsence(), this.listAbsence, OperationType.DELETE, id);
            this.absence = initObjectAbsence() ;
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
