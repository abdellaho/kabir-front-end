import { initObjectPays, Pays } from '@/models/pays';
import { PaysService } from '@/services/pays/pays-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {CommonModule} from "@angular/common";
import {Table, TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";

@Component({
    standalone: true,
  selector: 'app-pays-component',
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
    InputTextModule
],
  templateUrl: './pays-component.html',
  styleUrl: './pays-component.scss'
})
export class PaysComponent implements OnInit {

    constructor(
      private paysService: PaysService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private loadingService: LoadingService,
    ) { }

    cols: any[] = [];
    listPays: Pays[] = [];
    pays: Pays = initObjectPays();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;

    ngOnInit(): void {
      this.getAllPays();
      this.initFormGroup();
    }

    buildCols(): void {
      this.cols = [
          { field: 'pays', header: 'Pays' }
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
        pays: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      });
    }

    getAllPays(): void {
      this.paysService.getPays().subscribe({
        next: (data: Pays[]) => {
          this.listPays = data;
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
      this.pays = initObjectPays();
      this.initFormGroup();
    }

    recupperer(operation: number, paysEdit: Pays) {
      if(paysEdit && paysEdit.id) {
          this.pays = paysEdit;
          if(operation === 1) {
              this.formGroup.patchValue({
                  pays: this.pays.pays,
              });

              this.openCloseDialogAjouter(true);
          } else {
              this.openCloseDialogSupprimer(true);
          }
      } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
      }
    }

    updateList(pays: Pays, list: Pays[], operationType: OperationType, id?: bigint): Pays[] {
      if(operationType === OperationType.ADD) {
          list = [ ...list, pays ];
      } else if(operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.id === pays.id);
          if(index > -1) {
              list[index] = pays;
          }
      } else if(operationType === OperationType.DELETE) {
          list = list.filter(x => x.id !== id);
      }
      return list;
    }

    checkIfListIsNull() {
      if(null == this.listPays) {
          this.listPays = [];
      }
    }

    mapFormGroupToObject(formGroup: FormGroup, pays: Pays): Pays {
      pays.pays = formGroup.get('pays')?.value;

      return pays;
    }

    async miseAjour(): Promise<void> {
      let trvErreur = false;
      this.mapFormGroupToObject(this.formGroup, this.pays);
      if(!trvErreur){
        this.loadingService.show();
        this.submitted = true;


        if(this.pays.id) {
          this.paysService.updatePays(this.pays.id, this.pays).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
                this.checkIfListIsNull();
                this.listPays = this.updateList(data, this.listPays, OperationType.MODIFY);
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
            }, complete: () => {
              this.loadingService.hide();
            }
          });
        } else {
          this.paysService.createPays(this.pays).subscribe({
              next: (data: Pays) => {
                  this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                  this.checkIfListIsNull();
                  this.listPays = this.updateList(data, this.listPays, OperationType.ADD);
                  this.openCloseDialogAjouter(false);
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

    supprimer(): void {
      if(this.pays && this.pays.id) {
        this.loadingService.show();
        let id = this.pays.id;
        this.paysService.deletePays(this.pays.id).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
              this.checkIfListIsNull();
              this.listPays = this.updateList(initObjectPays(), this.listPays, OperationType.DELETE, id);
              this.pays = initObjectPays() ;
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
