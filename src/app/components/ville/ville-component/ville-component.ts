import { initObjectVille, Ville } from '@/models/ville';
import { VilleService } from '@/services/ville/ville-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { Table, TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { CommonModule } from '@angular/common';
import { SelectModule } from "primeng/select";
import { getAttribut } from '@/shared/classes/generic-methods';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  standalone: true,
  selector: 'app-ville-component',
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
    FloatLabelModule,
    InputTextModule
],
  templateUrl: './ville-component.html',
  styleUrl: './ville-component.scss'
})
export class VilleComponent implements OnInit {

  constructor(
    private villeService: VilleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) { }

  cols: any[] = [];
  listVille: Ville[] = [];
  ville: Ville = initObjectVille();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  formGroup!: FormGroup;
  mapOfPays: Map<number, string> = new Map<number, string>();

  ngOnInit(): void {
    this.getAllVilles();
    this.initFormGroup();
  }

  buildCols(): void {
    this.cols = [
      { field: 'nomVille', header: 'Ville' },
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      nomVille: ['', [Validators.required]],
    });
  }

  getAllVilles(): void {
    this.villeService.getVilles().subscribe({
      next: (data: Ville[]) => {
        this.listVille = data;
        this.loading = false;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getPaysLib(id: number): string {
    return getAttribut(id, this.mapOfPays);
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
    this.ville = initObjectVille();
    this.initFormGroup();
  }

  recupperer(operation: number, villeEdit: Ville) {
    if(villeEdit && villeEdit.id) {
        this.ville = villeEdit;
        if(operation === 1) {
            this.formGroup.patchValue({
                nomVille: this.ville.nomVille
            });

            this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(ville: Ville, list: Ville[], operationType: OperationType, id?: bigint): Ville[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, ville ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === ville.id);
        if(index > -1) {
            list[index] = ville;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listVille) {
        this.listVille = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, ville: Ville): Ville {
    ville.nomVille = formGroup.get('nomVille')?.value;

    return ville;
  }

  async miseAjour(): Promise<void> {
    let trvErreur = false;
    if(!trvErreur) {
      this.ville = this.mapFormGroupToObject(this.formGroup, this.ville);
      this.loadingService.show();
      this.submitted = true;

      if(this.ville.id) {
        this.villeService.updateVille(this.ville.id, this.ville).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listVille = this.updateList(data, this.listVille, OperationType.MODIFY);
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
        this.villeService.createVille(this.ville).subscribe({
            next: (data: Ville) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listVille = this.updateList(data, this.listVille, OperationType.ADD);
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
    }
  }

  supprimer(): void {
    if(this.ville && this.ville.id) {
      this.loadingService.show();
      let id = this.ville.id;
      this.villeService.deleteVille(this.ville.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listVille = this.updateList(initObjectVille(), this.listVille, OperationType.DELETE, id);
            this.ville = initObjectVille() ;
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
