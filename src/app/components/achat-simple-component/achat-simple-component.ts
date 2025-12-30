import { initObjectStock, Stock } from '@/models/stock';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { AchatSimple, initObjectAchatSimple } from '@/models/achat-simple';
import { DetAchatSimple, initObjectDetAchatSimple } from '@/models/det-achat-simple';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { AchatSimpleService } from '@/services/achat-simple/achat-simple-service';
import { StockService } from '@/services/stock/stock-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { TypeSearch } from '@/shared/enums/type-search';
import { AchatSimpleRequest } from '@/shared/classes/achat-simple-request';
import { OperationType } from '@/shared/enums/operation-type';
import { AchatSimpleValidator } from '@/validators/achat-simple-validator';

@Component({
  selector: 'app-achat-simple-component',
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
      SelectModule,
      DatePickerModule,
      MessageModule,
      InputTextModule
  ],
  templateUrl: './achat-simple-component.html',
  styleUrl: './achat-simple-component.scss'
})
export class AchatSimpleComponent {

    //Achat/BL
    //Buttons : Ajouter, Rechercher, Actualiser, Consulter
    //Tableau --> AchatBL ---> Date BL | Fournisseur | N BL Externe | Montant TTC | Actions
    // Ajouter --> Modal --> Date BL + Fournisseur + N BL Externe + Montant TTC + combo Produit + List Produits
    //Designation + Qte Stock + prix vente + qte + uniteGratuite + remise

  isValid: boolean = false;
  listStock: Stock[] = [];
  listAchatSimple: AchatSimple[] = [];
  listDetAchatSimple: DetAchatSimple[] = [];
  listFournisseur: Fournisseur[] = [];
  achatSimple: AchatSimple = initObjectAchatSimple();
  selectedAchatSimple!: AchatSimple;
  detAchatSimple: DetAchatSimple = initObjectDetAchatSimple();
  stock: Stock = initObjectStock();
  mapOfStock: Map<number, string> = new Map<number, string>();
  mapOfFournisseur: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogSupprimerDetAchatSimple: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;
  msg = APP_MESSAGES;
  readonly BigInt = BigInt; // Expose BigInt to template

  constructor(
      private achatSimpleService: AchatSimpleService,
      private stockService: StockService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private fournisseurService: FournisseurService,
      private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
      this.search();
      this.getAllStock();
      this.getAllFournisseur();
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
          dateOperation: [new Date(), [Validators.required]],
          stockId: [BigInt(0)],
          fournisseurId: [BigInt(0)],
          numBlExterne: [''],
          montant: [{ value: 0, disabled: true }],
          designation: [{ value: '', disabled: true }],
          qteStock: [{ value: 0, disabled: true }],
          qte: [1],
          prixVente: [0],
          remise: [0],
          uniteGratuite: [0],
      }, { validators: [AchatSimpleValidator({ getListDetAchatSimple: () => this.listDetAchatSimple })] });
  }

  search() {
      this.getAllStockDepot();
  }

  getAllStockDepot(): void {
      this.listAchatSimple = [];
      this.achatSimpleService.getAll().subscribe({
          next: (data: AchatSimple[]) => {
              this.listAchatSimple = data;
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  getAllFournisseur(): void {
      this.listFournisseur = [];
      let fournisseurSearch: Fournisseur = initObjectSearch(false, false, TypeSearch.Fournisseur);

      this.fournisseurService.search(fournisseurSearch).subscribe({
          next: (data: Fournisseur[]) => {
              let initFournisseur: Fournisseur = initObjectFournisseur();
              initFournisseur.id = BigInt(0);
              this.listFournisseur = [initFournisseur, ...data];
              this.mapOfFournisseur = arrayToMap(this.listFournisseur, 'id', ['designation'], ['']);
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  getAllStock(): void {
      this.listStock = [];
      let stockSearch: Stock = initObjectSearch(false, false, TypeSearch.Stock);

      this.stockService.search(stockSearch).subscribe({
          next: (data: Stock[]) => {
              let initStock: Stock = initObjectStock();
              initStock.id = BigInt(0);
              this.listStock = [initStock, ...data];
              this.mapOfStock = arrayToMap(this.listStock, 'id', ['designation'], ['']);
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  onChangeIdStock() {
      if(this.formGroup.get('stockId')?.value > BigInt(0)) {
          this.isValid = false;
          this.stock = initObjectStock();
          let isExistStock: boolean = false;

          this.listDetAchatSimple.forEach((detAchatSimple: DetAchatSimple) => {
              if(detAchatSimple.stockId === this.formGroup.get('stockId')?.value) {
                  isExistStock = true;

                  this.formGroup.patchValue({
                      stockId: BigInt(0),
                  });

                  return;
              }
          });
      
          if(!isExistStock) {
              this.stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
              this.formGroup.patchValue({
                  uniteGratuite: 0,
                  qteStock: this.stock.qteStock,
                  prixVente: this.stock.pvttc,
                  remise: 0,
                  qte: 1,
                  designation: this.stock.designation,
              });

              this.formGroup.get('designation')?.disable();
              this.formGroup.get('qteStock')?.disable();
              this.isValid = true;
          }
      }
  }

  initDetAchatSimpleFormInformation() {
      this.stock = initObjectStock();
      this.formGroup.patchValue({
          stockId: BigInt(0),
          prixVente: 0,
          qteStock: 0,
          remise: 0,
          uniteGratuite: 0,
          qte: 1,
          designation: '',
      });
      this.formGroup.get('designation')?.disable();
      this.formGroup.get('qteStock')?.disable();
  }

  recuppererDetAchatSimple(operation: number, detAchatSimpleEdit: DetAchatSimple) {
      if (detAchatSimpleEdit && detAchatSimpleEdit.stockId) {
          this.detAchatSimple = structuredClone(detAchatSimpleEdit);
          if (operation === 1) {
              this.openCloseDialogAjouter(true);
          } else if (operation === 2) {
              this.openCloseDialogSupprimerDetAchatSimple(true);
          }
      }
  }

  calculerTotal() {
        let montant: number = 0;
        if(this.listDetAchatSimple && this.listDetAchatSimple.length > 0) {
            this.listDetAchatSimple.forEach((detAchatSimple: DetAchatSimple) => {
                montant += detAchatSimple.montant;
            });
        }

        this.formGroup.patchValue({
            montant,
        });
  }

  validerDetAchatSimple() {
      if(this.formGroup.get('stockId')?.value > BigInt(0) && this.formGroup.get('qte')?.value > 0) {
          let detAchatSimple: DetAchatSimple = initObjectDetAchatSimple();
          detAchatSimple.stockId = this.formGroup.get('stockId')?.value;
          detAchatSimple.qte = this.formGroup.get('qte')?.value;
          detAchatSimple.prixVente = this.formGroup.get('prixVente')?.value;
          detAchatSimple.remise = this.formGroup.get('remise')?.value;
          detAchatSimple.uniteGratuite = this.formGroup.get('uniteGratuite')?.value;
          
          let stock: Stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
          detAchatSimple.stock = stock;
          detAchatSimple.montant = (detAchatSimple.qte * detAchatSimple.prixVente) - (detAchatSimple.qte * detAchatSimple.prixVente * detAchatSimple.remise * 0.01);

          this.listDetAchatSimple.push(detAchatSimple);
          
          this.initDetAchatSimpleFormInformation();
          this.calculerTotal();
      }
  }

  supprimerDetAchatSimple() {
      this.listDetAchatSimple = this.listDetAchatSimple.filter((detAchatSimple: DetAchatSimple) => detAchatSimple.stockId !== this.detAchatSimple.stockId);
      this.calculerTotal();
      this.formGroup.updateValueAndValidity();
      this.openCloseDialogSupprimerDetAchatSimple(false);
  }

  openCloseDialogAjouter(openClose: boolean): void {
      this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
      this.dialogSupprimer = openClose;
  }

  openCloseDialogSupprimerDetAchatSimple(openClose: boolean): void {
      this.dialogSupprimerDetAchatSimple = openClose;
  }

  viderAjouter() {
      this.openCloseDialogAjouter(true);
      this.submitted = false;
      this.listDetAchatSimple = [];
      this.achatSimple = initObjectAchatSimple();
      this.initFormGroup();
  }

  getDesignation(id: number): string {
      return getElementFromMap(this.mapOfStock, id);
  }

  getDesignationFournisseur(id: number): string {
      return getElementFromMap(this.mapOfFournisseur, id);
  }

  recupperer(operation: number, achatSimpleEdit: AchatSimple) {
      if (achatSimpleEdit && achatSimpleEdit.id) {
          if (operation === 1) {
              this.achatSimpleService.getByIdRequest(achatSimpleEdit.id).subscribe({
                  next: (data: AchatSimpleRequest) => {
                      this.achatSimple = data.achatSimple;
                      this.listDetAchatSimple = data.detAchatSimples;

                      this.listDetAchatSimple.forEach((detAchatSimple: DetAchatSimple) => {
                          if(detAchatSimple.stockId && detAchatSimple.stockId !== BigInt(0)) {
                              let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detAchatSimple.stockId) || initObjectStock();
                              detAchatSimple.stock = stock;
                          }
                      });
                      
                      this.formGroup.patchValue({
                          uniteGratuite: 0,
                          qteStock: 0,
                          prixVente: 0,
                          remise: 0,
                          designation: '',
                          stockId: BigInt(0),
                          qte: 1,
                          dateOperation: new Date(this.achatSimple.dateOperation),
                          fournisseurId: this.achatSimple.fournisseurId,
                          numBlExterne: this.achatSimple.numBlExterne,
                          montant: this.achatSimple.montant,
                      });

                      this.formGroup.get('designation')?.disable();
                      this.formGroup.get('qteStock')?.disable();
                      this.formGroup.updateValueAndValidity();

                      this.openCloseDialogAjouter(true);
                  }, error: (error: any) => {
                      console.error(error);
                  }, complete: () => {
                      this.loadingService.hide();
                  }
              });
          } else if (operation === 2) {
              this.achatSimple = structuredClone(achatSimpleEdit);
              this.openCloseDialogSupprimer(true);
          }
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
      }
  }

  updateList(achatSimple: AchatSimple, list: AchatSimple[], operationType: OperationType, id?: bigint): AchatSimple[] {
      if (operationType === OperationType.ADD) {
          list = [...list, achatSimple];
      } else if (operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.id === achatSimple.id);
          if (index > -1) {
              list[index] = achatSimple;
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.id !== id);
      }
      return list;
  }

  checkIfListIsNull() {
      if (null == this.listAchatSimple) {
          this.listAchatSimple = [];
      }
  }

  mapFormGroupToObject(formGroup: FormGroup, achatSimple: AchatSimple): AchatSimple {
      achatSimple.dateOperation = mapToDateTimeBackEnd(formGroup.get('dateOperation')?.value);
      achatSimple.fournisseurId = formGroup.get('fournisseurId')?.value;
      achatSimple.numBlExterne = formGroup.get('numBlExterne')?.value;
      achatSimple.montant = formGroup.get('montant')?.value || 0;

      return achatSimple;
  }

  async miseAjour(): Promise<void> {
      this.submitted = true;
      this.loadingService.show();
      let stockDepotEdit: AchatSimple = { ...this.achatSimple };
      this.mapFormGroupToObject(this.formGroup, stockDepotEdit);
      let trvErreur = false;// await this.checkIfExists(stockDepotEdit);

      if (!trvErreur) {
          this.achatSimple = this.mapFormGroupToObject(this.formGroup, this.achatSimple);

          let achatSimpleRequest: AchatSimpleRequest = { achatSimple: {...this.achatSimple }, detAchatSimples: this.listDetAchatSimple };

          if (this.achatSimple.id) {
              this.achatSimpleService.update(this.achatSimple.id, achatSimpleRequest).subscribe({
                  next: (data) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageUpdateSuccess
                      });

                      this.listDetAchatSimple = [];
                      this.checkIfListIsNull();
                      this.listAchatSimple = this.updateList(data, this.listAchatSimple, OperationType.MODIFY);
                      this.openCloseDialogAjouter(false);
                  }, error: (err) => {
                      console.log(err);
                      this.loadingService.hide();
                      this.messageService.add({
                          severity: 'error',
                          summary: this.msg.summary.labelError,
                          detail: this.msg.messages.messageErrorProduite
                      });
                  }, complete: () => {
                      this.loadingService.hide();
                  }
              });
          } else {
              this.achatSimpleService.create(achatSimpleRequest).subscribe({
                  next: (data: AchatSimple) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageAddSuccess
                      });

                      this.listDetAchatSimple = [];
                      this.checkIfListIsNull();
                      this.listAchatSimple = this.updateList(data, this.listAchatSimple, OperationType.ADD);
                      this.openCloseDialogAjouter(false);
                  }, error: (err) => {
                      console.log(err);
                      this.loadingService.hide();
                      this.messageService.add({
                          severity: 'error',
                          summary: this.msg.summary.labelError,
                          detail: this.msg.messages.messageErrorProduite
                      });
                  }, complete: () => {
                      this.loadingService.hide();
                  }
              });
          }
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.stock.label} ${this.msg.messages.messageExistDeja}` });
          this.loadingService.hide();
      }
  }

  supprimer(): void {
      if (this.achatSimple && this.achatSimple.id) {
          this.loadingService.show();
          let id = this.achatSimple.id;
          this.achatSimpleService.delete(this.achatSimple.id).subscribe({
              next: (data) => {
                  this.messageService.add({
                      severity: 'success',
                      summary: this.msg.summary.labelSuccess,
                      closable: true,
                      detail: this.msg.messages.messageDeleteSuccess
                  });

                  this.checkIfListIsNull();
                  this.listAchatSimple = this.updateList(initObjectAchatSimple(), this.listAchatSimple, OperationType.DELETE, id);
                  this.achatSimple = initObjectAchatSimple();
              }, error: (err) => {
                  console.log(err);
                  this.loadingService.hide();
                  this.messageService.add({
                      severity: 'error',
                      summary: this.msg.summary.labelError,
                      detail: this.msg.messages.messageErrorProduite
                  });
              }, complete: () => {
                  this.loadingService.hide();
              }
          });
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
      }

      this.openCloseDialogSupprimer(false);
  }

}
