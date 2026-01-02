import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { initObjectStock, Stock } from '@/models/stock';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { StockService } from '@/services/stock/stock-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { StockValidator } from '@/validators/stock-validator';
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
import { NegativeValidator } from '@/validators/negative-validator';
import { arrayToMap, getElementFromMap, initObjectSearch, returnValueOfNumberProperty } from '@/shared/classes/generic-methods';
import { TypeSearch } from '@/shared/enums/type-search';
import { filteredTypeProduit, TypeProduit } from '@/shared/enums/type-produit';

@Component({
    selector: 'app-stock-component',
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
        MessageModule,
        InputTextModule
    ],
    templateUrl: './stock-component.html',
    styleUrl: './stock-component.scss'
})
export class StockComponent {

    //Buttons ---> Ajouter + Rechercher + Actualiser + Archiver + Corbeille
    //Tableau ---> Designation + St Depot + st Facture + st mag + PA + PV.I + Prix comm + PV min + Remise max + Benif + Fourniss
    //Ajouter ---> Fourniss* + Designation* + PA* + PComm + PV* + TVA* + Benif + st mag + st fact + st depot
    //Benefice a la place du prix commercial, TVA ala place du benefice et TVA ---> type de produit (Interne ou externe)
    // Tableau ---> prixCommercial --> prix de vente 2

    /*
      PV1   QTE1  Remise1

      PV2   QTE2  Remise2

      PV3   QTE3  Remise3

      PV4   QTE4  Remise4


      MT1   Prime1
      MT2   Prime2
      MT3   Prime3

    */

    listFournisseur: Fournisseur[] = [];
    listStock: Stock[] = [];
    selectedStock!: Stock;
    stock: Stock = initObjectStock();
    typeOfList: number = 0;
    mapOfFournisseurs: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    dialogArchiver: boolean = false;
    dialogCorbeille: boolean = false;
    dialogAnnulerArchiver: boolean = false;
    dialogAnnulerCorbeille: boolean = false;
    submitted: boolean = false;
    typeProduits: { label: string; value: TypeProduit }[] = filteredTypeProduit;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;

    constructor(
        private fournisseurService: FournisseurService,
        private stockService: StockService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit(): void {
        this.typeOfList = 0;
        this.search();
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
            designation: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            fournisseurId: [0, [Validators.required, Validators.min(1)]],
            pvttc: [null, [Validators.required, Validators.min(0)]],
            pattc: [null, [Validators.required, Validators.min(0)]],
            tva: [20, [Validators.required, NegativeValidator]],
            benifice: [{ value: null, disabled: true }, [Validators.required, NegativeValidator]],
            qteStock: [null],
            qteFacturer: [null],
            qteStockImport: [null],
            prixVentMin1: [null, [NegativeValidator]],
            prixVentMin2: [null, [NegativeValidator]],
            prixVentMin3: [null, [NegativeValidator]],
            prixVentMin4: [null, [NegativeValidator]],
            qtePVMin1: [null, [NegativeValidator]],
            qtePVMin2: [null, [NegativeValidator]],
            qtePVMin3: [null, [NegativeValidator]],
            qtePVMin4: [null, [NegativeValidator]],
            remiseMax1: [{ value: null, disabled: true }, [NegativeValidator]],
            remiseMax2: [{ value: null, disabled: true }, [NegativeValidator]],
            remiseMax3: [{ value: null, disabled: true }, [NegativeValidator]],
            remiseMax4: [{ value: null, disabled: true }, [NegativeValidator]],
            montant1: [null, [NegativeValidator]],
            montant2: [null, [NegativeValidator]],
            montant3: [null, [NegativeValidator]],
            prime1: [null, [NegativeValidator]],
            prime2: [null, [NegativeValidator]],
            prime3: [null, [NegativeValidator]],
            typeProduit: [0, [Validators.required, Validators.min(1)]]
        }, { validators: [StockValidator] });
    }

    archiveListe(): void {
        this.typeOfList = 1;
        this.search();
    }

    corbeilleListe(): void {
        this.typeOfList = 2;
        this.search();
    }

    listOfStock(): void {
        this.typeOfList = 0;
        this.search();
    }

    search() {
        if (this.typeOfList === 1) {
            this.getAllStockArchive();
        } else if (this.typeOfList === 2) {
            this.getAllStockCorbeille();
        } else {
            this.getAllStock();
        }
    }

    initStockSearch(archiver: boolean, supprimer: boolean): Stock {
        let stockSearch: Stock = initObjectStock();

        stockSearch.archiver = archiver;
        stockSearch.supprimer = supprimer;

        return stockSearch;
    }

    getAllStock(): void {
        let stockSearch: Stock = this.initStockSearch(false, false);
        this.stockService.search(stockSearch).subscribe({
            next: (data: Stock[]) => {
                this.listStock = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllStockArchive(): void {
        let stockSearch: Stock = this.initStockSearch(true, false);

        this.stockService.search(stockSearch).subscribe({
            next: (data: Stock[]) => {
                this.listStock = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllStockCorbeille(): void {
        let stockSearch: Stock = this.initStockSearch(false, true);

        this.stockService.search(stockSearch).subscribe({
            next: (data: Stock[]) => {
                this.listStock = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllFournisseur(): void {
        let objectSearch: Fournisseur = initObjectSearch(false, false, TypeSearch.Fournisseur);
        this.fournisseurService.search(objectSearch).subscribe({
            next: (data: Fournisseur[]) => {
                this.listFournisseur = data;
                this.mapOfFournisseurs = arrayToMap(this.listFournisseur, 'id', ['designation'], ['']);
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

    viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.stock = initObjectStock();
        this.initFormGroup();
    }

    getDesignation(id: number): string {
        return getElementFromMap(this.mapOfFournisseurs, id);
    }

    recupperer(operation: number, stockEdit: Stock) {
        if (stockEdit && stockEdit.id) {
            this.stock = stockEdit;
            if (operation === 1) {
                console.log(this.stock);
                this.formGroup.patchValue({
                    designation: this.stock.designation,
                    fournisseurId: this.stock.fournisseurId,
                    pattc: returnValueOfNumberProperty(this.stock.pattc),
                    pvttc: returnValueOfNumberProperty(this.stock.pvttc),
                    tva: this.stock.tva,
                    benifice: returnValueOfNumberProperty(this.stock.benifice),
                    qteStock: returnValueOfNumberProperty(this.stock.qteStock),
                    qteFacturer: returnValueOfNumberProperty(this.stock.qteFacturer),
                    qteStockImport: returnValueOfNumberProperty(this.stock.qteStockImport),
                    prixVentMin1: returnValueOfNumberProperty(this.stock.prixVentMin1),
                    prixVentMin2: returnValueOfNumberProperty(this.stock.prixVentMin2),
                    prixVentMin3: returnValueOfNumberProperty(this.stock.prixVentMin3),
                    prixVentMin4: returnValueOfNumberProperty(this.stock.prixVentMin4),
                    qtePVMin1: returnValueOfNumberProperty(this.stock.qtePVMin1),
                    qtePVMin2: returnValueOfNumberProperty(this.stock.qtePVMin2),
                    qtePVMin3: returnValueOfNumberProperty(this.stock.qtePVMin3),
                    qtePVMin4: returnValueOfNumberProperty(this.stock.qtePVMin4),
                    remiseMax1: returnValueOfNumberProperty(this.stock.remiseMax1),
                    remiseMax2: returnValueOfNumberProperty(this.stock.remiseMax2),
                    remiseMax3: returnValueOfNumberProperty(this.stock.remiseMax3),
                    remiseMax4: returnValueOfNumberProperty(this.stock.remiseMax4),
                    montant1: returnValueOfNumberProperty(this.stock.montant1),
                    montant2: returnValueOfNumberProperty(this.stock.montant2),
                    montant3: returnValueOfNumberProperty(this.stock.montant3),
                    prime1: returnValueOfNumberProperty(this.stock.prime1),
                    prime2: returnValueOfNumberProperty(this.stock.prime2),
                    prime3: returnValueOfNumberProperty(this.stock.prime3),
                    typeProduit: this.stock.typeProduit
                });

                this.openCloseDialogAjouter(true);
            } else if (operation === 2) {
                this.openCloseDialogSupprimer(true);
            } else if (operation === 3) {
                this.openCloseDialogArchiver(true);
            } else if (operation === 4) {
                this.openCloseDialogCorbeille(true);
            } else if (operation === 5) {
                this.openCloseDialogAnnulerArchiver(true);
            } else if (operation === 6) {
                this.openCloseDialogAnnulerCorbeille(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    calculerBenefice() {
        let pvMin: number = 0.0;
        let pattc: number = this.formGroup.get('pattc')?.value ?? 0;
        let benifice: number = 0.0;

        this.onChangePrixVenteMin(null);

        pvMin = (this.formGroup.get('prixVentMin4')?.value !== null && this.formGroup.get('prixVentMin4')?.value > 0) ? this.formGroup.get('prixVentMin4')?.value
            : (this.formGroup.get('prixVentMin3')?.value !== null && this.formGroup.get('prixVentMin3')?.value > 0) ? this.formGroup.get('prixVentMin3')?.value
                : (this.formGroup.get('prixVentMin2')?.value !== null && this.formGroup.get('prixVentMin2')?.value > 0) ? this.formGroup.get('prixVentMin2')?.value
                    : (this.formGroup.get('prixVentMin1')?.value !== null && this.formGroup.get('prixVentMin1')?.value > 0) ? this.formGroup.get('prixVentMin1')?.value 
                    : (this.formGroup.get('pvttc')?.value !== null && this.formGroup.get('pvttc')?.value > 0) ? this.formGroup.get('pvttc')?.value : 0;

        if (pvMin == 0.00) benifice = 100.00;
        else benifice = (((pvMin - pattc) / pvMin) * 100);

        console.log('PrixVenteMin : ', pvMin, ' - PATTC : ', pattc, ' - PVTTC : ', this.formGroup.get('pvttc')?.value, ' - BENEFICE : ', benifice);

        this.formGroup.patchValue({ benifice });
    }

    onChangePrixVenteMin(i: number | null) {
        if (null == i || i == 1) {
            let remiseMax1 = 0;
            if (this.formGroup.get('prixVentMin1') 
                && this.formGroup.get('prixVentMin1')?.value !== 0
                && this.formGroup.get('prixVentMin1')?.value !== null  
                && this.formGroup.get('pvttc')?.value 
                && this.formGroup.get('pvttc')?.value !== 0
                && this.formGroup.get('pvttc')?.value !== null) {
                remiseMax1 = (this.formGroup.get('pvttc')?.value - this.formGroup.get('prixVentMin1')?.value) / (this.formGroup.get('pvttc')?.value * 0.01);
            }

            this.formGroup.patchValue({ remiseMax1 });
        }

        if (null == i || i == 2) {
            let remiseMax2 = 0;
            if (this.formGroup.get('prixVentMin2') 
                && this.formGroup.get('prixVentMin2')?.value !== 0 
                && this.formGroup.get('prixVentMin2')?.value !== null
                && this.formGroup.get('pvttc')?.value 
                && this.formGroup.get('pvttc')?.value !== 0
                && this.formGroup.get('pvttc')?.value !== null) {
                remiseMax2 = (this.formGroup.get('pvttc')?.value - this.formGroup.get('prixVentMin2')?.value) / (this.formGroup.get('pvttc')?.value * 0.01);
            }

            this.formGroup.patchValue({ remiseMax2 });
        }

        if (null == i || i == 3) {
            let remiseMax3 = 0;
            if (this.formGroup.get('prixVentMin3') 
                    && this.formGroup.get('prixVentMin3')?.value !== 0 
                    && this.formGroup.get('prixVentMin3')?.value !== null 
                    && this.formGroup.get('pvttc')?.value 
                    && this.formGroup.get('pvttc')?.value !== 0
                    && this.formGroup.get('pvttc')?.value !== null) {
                remiseMax3 = (this.formGroup.get('pvttc')?.value - this.formGroup.get('prixVentMin3')?.value) / (this.formGroup.get('pvttc')?.value * 0.01);
            }

            this.formGroup.patchValue({ remiseMax3 });
        }

        if (null == i || i == 4) {
            let remiseMax4 = 0;
            if (this.formGroup.get('prixVentMin4') 
                && this.formGroup.get('prixVentMin4')?.value !== 0 
                && this.formGroup.get('prixVentMin4')?.value !== null 
                && this.formGroup.get('pvttc')?.value 
                && this.formGroup.get('pvttc')?.value !== 0
                && this.formGroup.get('pvttc')?.value !== null) {
                remiseMax4 = (this.formGroup.get('pvttc')?.value - this.formGroup.get('prixVentMin4')?.value) / (this.formGroup.get('pvttc')?.value * 0.01);
            }

            this.formGroup.patchValue({ remiseMax4 });
        }

        if (null != i) {
            this.calculerBenefice();
        }
    }

    updateList(stock: Stock, list: Stock[], operationType: OperationType, id?: bigint): Stock[] {
        if (operationType === OperationType.ADD) {
            list = [...list, stock];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex(x => x.id === stock.id);
            if (index > -1) {
                list[index] = stock;
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

    mapFormGroupToObject(formGroup: FormGroup, stock: Stock): Stock {
        stock.designation = formGroup.get('designation')?.value;
        stock.fournisseurId = formGroup.get('fournisseurId')?.value;
        stock.pattc = formGroup.get('pattc')?.value ?? 0;
        stock.pvttc = formGroup.get('pvttc')?.value ?? 0;
        stock.tva = formGroup.get('tva')?.value ?? 0;
        stock.benifice = formGroup.get('benifice')?.value ?? 0;
        stock.qteStock = formGroup.get('qteStock')?.value ?? 0;
        stock.qteFacturer = formGroup.get('qteFacturer')?.value ?? 0;
        stock.qteStockImport = formGroup.get('qteStockImport')?.value ?? 0;
        stock.prixVentMin1 = formGroup.get('prixVentMin1')?.value ?? 0;
        stock.prixVentMin2 = formGroup.get('prixVentMin2')?.value ?? 0;
        stock.prixVentMin3 = formGroup.get('prixVentMin3')?.value ?? 0;
        stock.prixVentMin4 = formGroup.get('prixVentMin4')?.value ?? 0;
        stock.qtePVMin1 = formGroup.get('qtePVMin1')?.value ?? 0;
        stock.qtePVMin2 = formGroup.get('qtePVMin2')?.value ?? 0;
        stock.qtePVMin3 = formGroup.get('qtePVMin3')?.value ?? 0;
        stock.qtePVMin4 = formGroup.get('qtePVMin4')?.value ?? 0;
        stock.remiseMax1 = formGroup.get('remiseMax1')?.value ?? 0;
        stock.remiseMax2 = formGroup.get('remiseMax2')?.value ?? 0;
        stock.remiseMax3 = formGroup.get('remiseMax3')?.value ?? 0;
        stock.remiseMax4 = formGroup.get('remiseMax4')?.value ?? 0;
        stock.montant1 = formGroup.get('montant1')?.value ?? 0;
        stock.montant2 = formGroup.get('montant2')?.value ?? 0;
        stock.montant3 = formGroup.get('montant3')?.value ?? 0;
        stock.prime1 = formGroup.get('prime1')?.value ?? 0;
        stock.prime2 = formGroup.get('prime2')?.value ?? 0;
        stock.prime3 = formGroup.get('prime3')?.value ?? 0;
        stock.typeProduit = formGroup.get('typeProduit')?.value ?? 1;

        return stock;
    }

    async checkIfExists(stock: Stock): Promise<boolean> {
        try {
            const existsObservable = this.stockService.exist(stock).pipe(
                catchError(error => {
                    console.error('Error in stock existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if stock exists:', error);
            return false;
        }
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let stockEdit: Stock = { ...this.stock };
        this.mapFormGroupToObject(this.formGroup, stockEdit);
        let trvErreur = await this.checkIfExists(stockEdit);

        if (!trvErreur) {
            this.mapFormGroupToObject(this.formGroup, this.stock);
            this.submitted = true;

            if (this.stock.id) {
                this.stockService.update(this.stock.id, this.stock).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });
                        this.checkIfListIsNull();
                        this.listStock = this.updateList(data, this.listStock, OperationType.MODIFY);
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
                this.stockService.create(this.stock).subscribe({
                    next: (data: Stock) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });
                        this.checkIfListIsNull();
                        this.listStock = this.updateList(data, this.listStock, OperationType.ADD);
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
        if (this.stock && this.stock.id) {
            this.loadingService.show();
            let id = this.stock.id;
            this.stockService.delete(this.stock.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });
                    this.checkIfListIsNull();
                    this.listStock = this.updateList(initObjectStock(), this.listStock, OperationType.DELETE, id);
                    this.stock = initObjectStock();
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

    archiver(archiver: boolean): void {
        if (this.stock && this.stock.id) {
            this.loadingService.show();
            let id = this.stock.id;
            this.stock.archiver = archiver;

            this.stockService.update(this.stock.id, this.stock).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listStock = this.updateList(initObjectStock(), this.listStock, OperationType.DELETE, id);
                    this.stock = initObjectStock();
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

        if (archiver) {
            this.openCloseDialogArchiver(false);
        } else {
            this.openCloseDialogAnnulerArchiver(false);
        }
    }

    corbeille(corbeille: boolean): void {
        if (this.stock && this.stock.id) {
            this.loadingService.show();
            let id = this.stock.id;
            this.stock.supprimer = corbeille;

            if(corbeille) {
                this.stock.dateSuppression = new Date();
            } else {
                this.stock.dateSuppression = null;
            }

            this.stockService.update(this.stock.id, this.stock).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listStock = this.updateList(initObjectStock(), this.listStock, OperationType.DELETE, id);
                    this.stock = initObjectStock();
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

        if (corbeille) {
            this.openCloseDialogCorbeille(false);
        } else {
            this.openCloseDialogAnnulerCorbeille(false);
        }
    }

}
