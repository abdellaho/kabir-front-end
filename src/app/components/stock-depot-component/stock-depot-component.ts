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
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { OperationType } from '@/shared/enums/operation-type';
import { initObjectStockDepot, StockDepot } from '@/models/stock-depot';
import { StockDepotService } from '@/services/stock-depot/stock-depot-service';
import { DatePickerModule } from 'primeng/datepicker';
import { DetStockDepot, initObjectDetStockDepot } from '@/models/det-stock-depot';
import { TypeSearch } from '@/shared/enums/type-search';
import { StockDepotRequest } from '@/shared/classes/stock-depot-request';

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

    //Affichage --> Buttons --> Ajouter Rechercher Actualiser Consulter
    //          ---> Achat Etranger (Ancien App)
    // Tableau  ---> date designation qte Actions(Supprimer seulement)
    // Ajouter --> date ListProduit --> designation + qte


    //Achat Simple
    //Affichage --> Buttons --> Ajouter Rechercher Actualiser Consulter
    //          ---> Achat BL (Ancien App)
    // Tableau  ---> date AL - fournisseur - N°BL Externe - montant TTCActions(Supprimer Modifier Imprimer)
    // Ajouter --> date - fournisseur - N°BL Externe - ListProduit --> designation + qte Stock + prix vente + qte + unite gratuite + remise

    isValid: boolean = false;
    listStock: Stock[] = [];
    listStockDepot: StockDepot[] = [];
    listDetStockDepot: DetStockDepot[] = [];
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
            qte: [1, [NegativeValidator]],
            designation: [{ value: '', disabled: true }],
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

    getAllStock(): void {
        this.listStock = [];
        let stockSearch: Stock = initObjectSearch(false, false, TypeSearch.Stock);

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

    onChangeIdStock() {
        this.isValid = false;
        this.stock = initObjectStock();
        
        if(this.formGroup.get('stockId')?.value > 0) {
            this.stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            
            this.formGroup.patchValue({
                qte: 1,
                designation: this.stock.designation,
            });

            this.formGroup.get('designation')?.disable();
            this.isValid = true;
        }
    }

    initDetStockDepotFormInformation() {
        this.stock = initObjectStock();
        this.formGroup.patchValue({
            stockId: 0,
            qte: 1,
            designation: '',
        });
        this.formGroup.get('designation')?.disable();
    }

    validerDetStockDepot() {
        if(this.formGroup.get('stockId')?.value > 0 && this.formGroup.get('qte')?.value > 0) {
            let detStockDepot: DetStockDepot = initObjectDetStockDepot();
            detStockDepot.stockId = this.formGroup.get('stockId')?.value;
            detStockDepot.qte = this.formGroup.get('qte')?.value;
            this.listDetStockDepot.push(detStockDepot);
            
            this.initDetStockDepotFormInformation();
        }
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
                    designation: '',
                    stockId: 0,
                    qte: 1,
                    dateOperation: new Date(this.stockDepot.dateOperation),
                });

                this.formGroup.get('designation')?.disable();

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
        if (null == this.listStockDepot) {
            this.listStockDepot = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, stockDepot: StockDepot): StockDepot {
        stockDepot.dateOperation = mapToDateTimeBackEnd(formGroup.get('dateOperation')?.value);

        return stockDepot;
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let stockDepotEdit: StockDepot = { ...this.stockDepot };
        this.mapFormGroupToObject(this.formGroup, stockDepotEdit);
        let trvErreur = false;// await this.checkIfExists(stockDepotEdit);

        if (!trvErreur) {
            this.stockDepot = this.mapFormGroupToObject(this.formGroup, this.stockDepot);

            let stockDepotRequest: StockDepotRequest = { stockDepot: {...this.stockDepot }, detStockDepots: this.listDetStockDepot };

            if (this.stockDepot.id) {
                this.stockDepotService.update(this.stockDepot.id, stockDepotRequest).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.listDetStockDepot = [];
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
                this.stockDepotService.create(stockDepotRequest).subscribe({
                    next: (data: StockDepot) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.listDetStockDepot = [];
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
