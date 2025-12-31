import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { initObjectStock, Stock } from '@/models/stock';
import { DetailBonSortie, initObjectDetailBonSortie } from '@/models/detail-bon-sortie';
import { BonSortie, initObjectBonSortie } from '@/models/bon-sortie';
import { BonSortieService } from '@/services/bon-sortie/bon-sortie-service';
import { StockService } from '@/services/stock/stock-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { TypeSearch } from '@/shared/enums/type-search';
import { BonSortieRequest } from '@/shared/classes/bon-sortie-request';
import { OperationType } from '@/shared/enums/operation-type';
import { BonSortieValidator } from '@/validators/bon-sortie-validator';

@Component({
  selector: 'app-bon-sortie-component',
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
  templateUrl: './bon-sortie-component.html',
  styleUrl: './bon-sortie-component.scss'
})
export class BonSortieComponent {

  isValid: boolean = false;
  listStock: Stock[] = [];
  listBonSortie: BonSortie[] = [];
  listDetailBonSortie: DetailBonSortie[] = [];
  bonSortie: BonSortie = initObjectBonSortie();
  selectedStockDepot!: BonSortie;
  detailBonSortie: DetailBonSortie = initObjectDetailBonSortie();
  stock: Stock = initObjectStock();
  mapOfStock: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogSupprimerDetBonSortie: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;
  msg = APP_MESSAGES;
  readonly BigInt = BigInt; // Expose BigInt to template

  constructor(
      private stockService: StockService,
      private bonSortieService: BonSortieService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
      this.search();
      this.getAllStock();
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
          qteSortie: [1],
          designation: [{ value: '', disabled: true }],
      }, { validators: [BonSortieValidator({ getListDetailBonSortie: () => this.listDetailBonSortie })] });
  }

  search() {
      this.getAllBonSortie();
  }

  getAllBonSortie(): void {
      this.listBonSortie = [];
      this.bonSortieService.getAll().subscribe({
          next: (data: BonSortie[]) => {
              this.listBonSortie = data;
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

          this.listDetailBonSortie.forEach((detailBonSortie: DetailBonSortie) => {
              if(detailBonSortie.stockId === this.formGroup.get('stockId')?.value) {
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
                  qte: 1,
                  designation: this.stock.designation,
              });

              this.formGroup.get('designation')?.disable();
              this.isValid = true;
          }
      }
  }

  initDetailBonSortieFormInformation() {
      this.stock = initObjectStock();
      this.formGroup.patchValue({
          stockId: BigInt(0),
          qte: 1,
          designation: '',
      });
      this.formGroup.get('designation')?.disable();
  }

  recuppererDetailBonSortie(operation: number, detailBonSortieEdit: DetailBonSortie) {
      if (detailBonSortieEdit && detailBonSortieEdit.stockId) {
          this.detailBonSortie = structuredClone(detailBonSortieEdit);
          if (operation === 1) {
              this.openCloseDialogAjouter(true);
          } else if (operation === 2) {
              this.openCloseDialogSupprimerDetBonSortie(true);
          }
      }
  }

  validerDetailBonSortie() {
      if(this.formGroup.get('stockId')?.value > BigInt(0) && this.formGroup.get('qteSortie')?.value > 0) {
          let detailBonSortie: DetailBonSortie = initObjectDetailBonSortie();
          detailBonSortie.stockId = this.formGroup.get('stockId')?.value;
          detailBonSortie.qteSortie = this.formGroup.get('qteSortie')?.value;
          let stock: Stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
          detailBonSortie.stock = stock;

          this.listDetailBonSortie.push(detailBonSortie);
          
          this.initDetailBonSortieFormInformation();
      }
  }

  supprimerDetailBonSortie() {
      this.listDetailBonSortie = this.listDetailBonSortie.filter((detailBonSortie: DetailBonSortie) => detailBonSortie.stockId !== this.detailBonSortie.stockId);
      this.formGroup.updateValueAndValidity();
      this.openCloseDialogSupprimerDetBonSortie(false);
  }

  openCloseDialogAjouter(openClose: boolean): void {
      this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
      this.dialogSupprimer = openClose;
  }

  openCloseDialogSupprimerDetBonSortie(openClose: boolean): void {
      this.dialogSupprimerDetBonSortie = openClose;
  }

  viderAjouter() {
      this.openCloseDialogAjouter(true);
      this.submitted = false;
      this.listDetailBonSortie = [];
      this.bonSortie = initObjectBonSortie();
      this.initFormGroup();
  }

  getDesignation(id: number): string {
      return getElementFromMap(this.mapOfStock, id);
  }

  recupperer(operation: number, bonSortieEdit: BonSortie) {
      if (bonSortieEdit && bonSortieEdit.id) {
          if (operation === 1) {
              this.bonSortieService.getByIdRequest(bonSortieEdit.id).subscribe({
                  next: (data: BonSortieRequest) => {
                      this.bonSortie = data.bonSortie;
                      this.listDetailBonSortie = data.detailBonSorties;

                      this.listDetailBonSortie.forEach((detailBonSortie: DetailBonSortie) => {
                          if(detailBonSortie.stockId && detailBonSortie.stockId !== BigInt(0)) {
                              let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detailBonSortie.stockId) || initObjectStock();
                              detailBonSortie.stock = stock;
                          }
                      });
                      
                      this.formGroup.patchValue({
                          designation: '',
                          stockId: BigInt(0),
                          qte: 1,
                          dateOperation: new Date(this.bonSortie.dateOperation),
                      });
                      this.formGroup.get('designation')?.disable();
                      this.formGroup.updateValueAndValidity();

                      this.openCloseDialogAjouter(true);
                  }, error: (error: any) => {
                      console.error(error);
                  }, complete: () => {
                      this.loadingService.hide();
                  }
              });
          } else if (operation === 2) {
              this.bonSortie = structuredClone(bonSortieEdit);
              this.openCloseDialogSupprimer(true);
          }
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
      }
  }

  updateList(bonSortie: BonSortie, list: BonSortie[], operationType: OperationType, id?: bigint): BonSortie[] {
      if (operationType === OperationType.ADD) {
          list = [...list, bonSortie];
      } else if (operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.id === bonSortie.id);
          if (index > -1) {
              list[index] = bonSortie;
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.id !== id);
      }
      return list;
  }

  checkIfListIsNull() {
      if (null == this.listBonSortie) {
          this.listBonSortie = [];
      }
  }

  mapFormGroupToObject(formGroup: FormGroup, bonSortie: BonSortie): BonSortie {
      bonSortie.dateOperation = mapToDateTimeBackEnd(formGroup.get('dateOperation')?.value);

      return bonSortie;
  }

  async miseAjour(): Promise<void> {
      this.submitted = true;
      this.loadingService.show();
      let bonSortieEdit: BonSortie = { ...this.bonSortie };
      this.mapFormGroupToObject(this.formGroup, bonSortieEdit);
      let trvErreur = false;// await this.checkIfExists(bonSortieEdit);

      if (!trvErreur) {
          this.bonSortie = this.mapFormGroupToObject(this.formGroup, this.bonSortie);

          let stockDepotRequest: BonSortieRequest = { bonSortie: {...this.bonSortie }, detailBonSorties: this.listDetailBonSortie };

          if (this.bonSortie.id) {
              this.bonSortieService.update(this.bonSortie.id, stockDepotRequest).subscribe({
                  next: (data) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageUpdateSuccess
                      });

                      this.listDetailBonSortie = [];
                      this.checkIfListIsNull();
                      this.listBonSortie = this.updateList(data, this.listBonSortie, OperationType.MODIFY);
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
              this.bonSortieService.create(stockDepotRequest).subscribe({
                  next: (data: BonSortie) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageAddSuccess
                      });

                      this.listDetailBonSortie = [];
                      this.checkIfListIsNull();
                      this.listBonSortie = this.updateList(data, this.listBonSortie, OperationType.ADD);
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
      if (this.bonSortie && this.bonSortie.id) {
          this.loadingService.show();
          let id = this.bonSortie.id;
          this.bonSortieService.delete(this.bonSortie.id).subscribe({
              next: (data) => {
                  this.messageService.add({
                      severity: 'success',
                      summary: this.msg.summary.labelSuccess,
                      closable: true,
                      detail: this.msg.messages.messageDeleteSuccess
                  });

                  this.checkIfListIsNull();
                  this.listBonSortie = this.updateList(initObjectBonSortie(), this.listBonSortie, OperationType.DELETE, id);
                  this.bonSortie = initObjectBonSortie();
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
