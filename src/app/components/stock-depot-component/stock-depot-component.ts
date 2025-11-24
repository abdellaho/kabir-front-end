import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { initObjectStock, Stock } from '@/models/stock';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { StockService } from '@/services/stock/stock-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { NegativeValidator } from '@/validators/negative-validator';
import { StockValidator } from '@/validators/stock-validator';
import { arrayToMap, getElementFromMap } from '@/shared/classes/generic-methods';
import { OperationType } from '@/shared/enums/operation-type';
import { initObjectStockDepot, StockDepot } from '@/models/stock-depot';
import { StockDepotService } from '@/services/stock-depot/stock-depot-service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-stock-depot-component',
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
  templateUrl: './stock-depot-component.html',
  styleUrl: './stock-depot-component.scss'
})
export class StockDepotComponent {

    listStock: Stock[] = [];
    listStockDepot: StockDepot[] = [];
    stockDepot: StockDepot = initObjectStockDepot();
    selectedStockDepot!: StockDepot;
    stock: Stock = initObjectStock();
    mapOfStock: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;

    constructor(
        private stockDepotService: StockDepotService,
        private stockService: StockService,
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
            stockId: [0, [Validators.required, Validators.min(1)]],
            qteStockDepot: [1, [NegativeValidator]],
        }, { validators: [StockValidator] });
    }

    search() {
        this.getAllStockDepot();
    }

    getAllStockDepot(): void {
        this.listStockDepot = [];
        this.stockDepotService.getAll().subscribe({
            next: (data: StockDepot[]) => {
                this.listStockDepot = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    initStockSearch(archiver: boolean, supprimer: boolean): Stock {
        let stockSearch: Stock = initObjectStock();

        stockSearch.archiver = archiver;
        stockSearch.supprimer = supprimer;

        return stockSearch;
    }

    getAllStock(): void {
        this.listStock = [];
        let stockSearch: Stock = this.initStockSearch(false, false);

        this.stockService.search(stockSearch).subscribe({
            next: (data: Stock[]) => {
                this.listStock = data;
                this.mapOfStock = arrayToMap(this.listStock, 'id', ['designation'], ['']);
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
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
        this.stockDepot = initObjectStockDepot();
        this.initFormGroup();
    }

    getDesignation(id: number): string {
        return getElementFromMap(this.mapOfStock, id);
    }

    recupperer(operation: number, stockDepotEdit: StockDepot) {
        if (stockDepotEdit && stockDepotEdit.id) {
            this.stockDepot = stockDepotEdit;
            if (operation === 1) {
                this.formGroup.patchValue({
                    stockId: this.stockDepot.stockId,
                    qteStockDepot: this.stockDepot.qteStockDepot,
                    dateOperation: new Date(this.stockDepot.dateOperation),
                });

                this.openCloseDialogAjouter(true);
            } else if (operation === 2) {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(stockDepot: StockDepot, list: StockDepot[], operationType: OperationType, id?: bigint): StockDepot[] {
        if (operationType === OperationType.ADD) {
            list = [...list, stockDepot];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex(x => x.id === stockDepot.id);
            if (index > -1) {
                list[index] = stockDepot;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter(x => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listStock) {
            this.listStock = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, stockDepot: StockDepot): StockDepot {
        stockDepot.qteStockDepot = formGroup.get('qteStockDepot')?.value;
        stockDepot.stockId = formGroup.get('stockId')?.value;
        stockDepot.dateOperation = formGroup.get('dateOperation')?.value;

        return stockDepot;
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let stockDepotEdit: StockDepot = { ...this.stockDepot };
        this.mapFormGroupToObject(this.formGroup, stockDepotEdit);
        let trvErreur = false;// await this.checkIfExists(stockDepotEdit);

        if (!trvErreur) {
            this.mapFormGroupToObject(this.formGroup, this.stockDepot);
            this.submitted = true;

            if (this.stockDepot.id) {
                this.stockDepotService.update(this.stockDepot.id, this.stockDepot).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });
                        this.checkIfListIsNull();
                        this.listStockDepot = this.updateList(data, this.listStockDepot, OperationType.MODIFY);
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
                this.stockDepotService.create(this.stockDepot).subscribe({
                    next: (data: StockDepot) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });
                        this.checkIfListIsNull();
                        this.listStockDepot = this.updateList(data, this.listStockDepot, OperationType.ADD);
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
        if (this.stockDepot && this.stockDepot.id) {
            this.loadingService.show();
            let id = this.stockDepot.id;
            this.stockDepotService.delete(this.stockDepot.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });
                    this.checkIfListIsNull();
                    this.listStockDepot = this.updateList(initObjectStockDepot(), this.listStockDepot, OperationType.DELETE, id);
                    this.stockDepot = initObjectStockDepot();
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
