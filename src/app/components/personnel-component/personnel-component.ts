import { RepertoireService } from '@/services/repertoire/repertoire-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypePersonnelAll, TypePersonnel } from '@/shared/enums/type-personnel';
import { PersonnelSearch } from '@/shared/searchModels/personnel-search';
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
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { PasswordModule } from "primeng/password";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { ToggleButtonModule } from "primeng/togglebutton";
import { FloatLabelModule } from "primeng/floatlabel";
import { SelectModule } from "primeng/select";
import { initObjectRepertoire, Repertoire } from '@/models/Repertoire';

@Component({
  selector: 'app-personnel-component',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    ReactiveFormsModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    DatePickerModule,
    InputNumberModule,
    ToggleButtonModule,
    FloatLabelModule,
    SelectModule
],
  templateUrl: './personnel-component.html',
  styleUrl: './personnel-component.scss'
})
export class PersonnelComponent implements OnInit {

  personnel: Repertoire = initObjectRepertoire();
  listPersonnel: Repertoire[] = [];
  typePersonnel: { label: string, value: TypePersonnel }[] = filteredTypePersonnelAll;
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  formGroup!: FormGroup;

  constructor(
    private repertoireService: RepertoireService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.initFormGroup();
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openCloseDialogAjouter(openClose: boolean): void {
    this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
    this.dialogSupprimer = openClose;
  }

  getAll(): void {
    this.repertoireService.getAll().subscribe({
      next: (data: Repertoire[]) => {
        this.listPersonnel = data;
        this.loading = false;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      designation: ['', [Validators.required, Validators.min(1)]],
      cin: ['', [Validators.required, Validators.min(1)]],
      login: [''],
      password: [''],
      typePersonnel: [0],
      dateEntrer: [new Date()],
      tel1: [''],
      tel2: [''],
      adresse: [''],
      salaire: [0],
      etatComptePersonnel: [false],
    });
  }

  viderAjouter() {
    this.openCloseDialogAjouter(true);
    this.submitted = false;
    this.personnel = initObjectRepertoire();
    this.initFormGroup();
  }

  recupperer(operation: number, personnelEdit: Repertoire) {
    if(personnelEdit && personnelEdit.id) {
        this.personnel = personnelEdit;
        if(operation === 1) {
            this.formGroup.patchValue({
              designation: this.personnel.designation,
              cin: this.personnel.cin,
              login: this.personnel.login,
              password: '', //this.personnel.password,
              typePersonnel: this.personnel.typePersonnel,
              dateEntrer: this.personnel.dateEntrer,
              tel1: this.personnel.tel1,
              tel2: this.personnel.tel2,
              adresse: this.personnel.adresse,
              salaire: this.personnel.salaire,
              etatComptePersonnel: this.personnel.etatComptePersonnel
            });

            this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(personnel: Repertoire, list: Repertoire[], operationType: OperationType, id?: bigint): Repertoire[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, personnel ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === personnel.id);
        if(index > -1) {
            list[index] = personnel;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listPersonnel) {
        this.listPersonnel = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, personnel: Repertoire): Repertoire {
    personnel.designation = formGroup.get('designation')?.value;
    personnel.cin = formGroup.get('cin')?.value;
    personnel.login = formGroup.get('login')?.value;
    personnel.password = formGroup.get('password')?.value;
    personnel.typePersonnel = formGroup.get('typePersonnel')?.value;
    personnel.dateEntrer = formGroup.get('dateEntrer')?.value;
    personnel.tel1 = formGroup.get('tel1')?.value;
    personnel.tel2 = formGroup.get('tel2')?.value;
    personnel.adresse = formGroup.get('adresse')?.value;
    personnel.salaire = formGroup.get('salaire')?.value;
    personnel.etatComptePersonnel= formGroup.get('etatComptePersonnel')?.value;

    return personnel;
  }

  async checkIfExists(personnel: PersonnelSearch): Promise<boolean> {
    try {
      const existsObservable = this.repertoireService.searchPersonnel(personnel).pipe(
        catchError(error => {
          console.error('Error in personnel existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if personnel exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let personnelEdit: Repertoire = { ...this.personnel };
    personnelEdit = this.mapFormGroupToObject(this.formGroup, personnelEdit);
    let personnelSearch: PersonnelSearch = { ...personnelEdit, id: this.personnel.id };
    let trvErreur = await this.checkIfExists(personnelSearch);
    
    if(!trvErreur) {
      this.personnel = this.mapFormGroupToObject(this.formGroup, this.personnel);
      this.submitted = true;
      console.log('Personnel : ', this.personnel);
      
      if(this.personnel.id) {
        this.repertoireService.update(this.personnel.id, this.personnel).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listPersonnel = this.updateList(data, this.listPersonnel, OperationType.MODIFY);
              this.openCloseDialogAjouter(false);
          }, error: (err) => {
              console.log(err);
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.repertoireService.create(this.personnel).subscribe({
            next: (data: Repertoire) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listPersonnel = this.updateList(data, this.listPersonnel, OperationType.ADD);
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le personnel existe deja" });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.personnel && this.personnel.id) {
      this.loadingService.show();
      let id = this.personnel.id;
      this.repertoireService.delete(this.personnel.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listPersonnel = this.updateList(initObjectRepertoire(), this.listPersonnel, OperationType.DELETE, id);
            this.personnel = initObjectRepertoire() ;
        }, error: (err) => {
            console.log(err);
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
