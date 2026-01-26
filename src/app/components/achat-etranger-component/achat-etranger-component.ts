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
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { initObjectStock, Stock } from '@/models/stock';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { TypeSearch } from '@/shared/enums/type-search';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd, toLocalDate } from '@/shared/classes/generic-methods';
import { StockService } from '@/services/stock/stock-service';
import { MessageService } from 'primeng/api';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { LoadingService } from '@/shared/services/loading-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypeReglement } from '@/shared/enums/type-reglement';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AchatEtranger, initObjectAchatEtranger } from '@/models/achat-etranger';
import { DetAchatEtranger, initObjectDetAchatEtranger } from '@/models/det-achat-etranger';
import { AchatEtrangerService } from '@/services/achat-etranger/achat-etranger-service';
import { AchatEtrangerRequest } from '@/shared/classes/achat-etranger-request';
import { StateService } from '@/state/state-service';

@Component({
    selector: 'app-achat-etranger-component',
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
    templateUrl: './achat-etranger-component.html',
    styleUrl: './achat-etranger-component.scss'
})
export class AchatEtrangerComponent {
    //Import dans l'application precedente
    //Affichage --> fournisseur + Num Facture + Date Facture + montant facture + montant payer
    // + taux + transport international + la douane +  magazinage + total
    //Tableau -->
    //Ajouter --> fournisseur     + Num Facture             + Date Facture             + montant facture (text comme 135 usd)
    //            Date viremeent1 + mnt virement 1          + Date virement 2          + mnt virement 2
    //            monatnt payé    + transport international + la douane                + magazinage
    //            combo produit   + total payé
    // tableau produits ---> Designation + stock facture + stock depot + qte achat + prix Achat + button supprimer
    // fenetre Ajouter produit --> Designation + Qtock Depot + Qte Fact + Qte Achat + Prix Achat

    personnelCreationId: number | null = null;
    isValid: boolean = false;
    listStock: Stock[] = [];
    listAchatEtranger: AchatEtranger[] = [];
    listDetAchatEtranger: DetAchatEtranger[] = [];
    listFournisseur: Fournisseur[] = [];
    achatEtranger: AchatEtranger = initObjectAchatEtranger();
    achatEtrangerAncien: AchatEtranger = initObjectAchatEtranger();
    selectedAchatEtranger!: AchatEtranger;
    detAchatEtranger: DetAchatEtranger = initObjectDetAchatEtranger();
    stock: Stock = initObjectStock();
    mapOfStock: Map<number, string> = new Map<number, string>();
    mapOfFournisseur: Map<number, string> = new Map<number, string>();
    mapOfFournisseurICE: Map<number, string> = new Map<number, string>();
    typeReglements: { label: string; value: number }[] = filteredTypeReglement;
    dialogSupprimer: boolean = false;
    dialogAjouterDetAchatEtranger: boolean = false;
    dialogSupprimerDetAchatEtranger: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    formGroupDetAchatEtranger!: FormGroup;
    msg = APP_MESSAGES;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private achatEtrangerService: AchatEtrangerService,
        private stockService: StockService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private fournisseurService: FournisseurService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.search();
        this.getAllStock();
        this.getAllFournisseur();
        this.initFormGroup();
        this.initFormGroupDetAchatEtranger();
    }

    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    initFormGroupDetAchatEtranger() {
        this.formGroupDetAchatEtranger = this.formBuilder.group({
            designation: [{ value: this.stock.designation, disabled: true }],
            qteStockImport: [{ value: this.stock.qteStockImport, disabled: true }],
            qteFacturer: [{ value: this.stock.qteFacturer, disabled: true }],
            qteAchat: [0, [Validators.required, Validators.min(1)]],
            prixAchat: [0]
        });
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group({
            fournisseurId: [BigInt(0), [Validators.required, Validators.min(1)]],
            codeFacture: ['', [Validators.required]],
            dateFacture: [new Date(), [Validators.required]],
            mntFacture: ['', [Validators.required]],

            dateAvances1: [new Date()],
            mantantAvancs1: [0],
            dateAvances2: [new Date()],
            mantantAvancs2: [0],

            totalPaye: [{ value: 0, disabled: true }],
            mntTransportIntern: [0],
            mntDouane: [0],
            mntMagasinage: [0],

            totalAllMnt: [{ value: 0, disabled: true }],
            stockId: [BigInt(0)]
        });
    }

    search() {
        this.getAllAchatFacture();
    }

    getAllAchatFacture(): void {
        this.listAchatEtranger = [];
        this.achatEtrangerService.getAll().subscribe({
            next: (data: AchatEtranger[]) => {
                this.listAchatEtranger = data;
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
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
                this.mapOfFournisseurICE = arrayToMap(this.listFournisseur, 'id', ['ice'], ['']);
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
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
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
                this.loadingService.hide();
            }
        });
    }

    afficherProduitsAchatEtranger() {
        if (this.formGroup.get('stockId')?.value > BigInt(0)) {
            let stock: Stock = this.listStock.find((e) => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            this.detAchatEtranger = initObjectDetAchatEtranger();

            let existe: boolean = this.listDetAchatEtranger.some((e) => e.stockId === this.formGroup.get('stockId')?.value);

            if (existe === false) {
                this.detAchatEtranger.stockId = this.formGroup.get('stockId')?.value;
                this.detAchatEtranger.stock = stock;
            }

            this.dialogAjouterDetAchatEtranger = true;
        }
    }

    onChangeIdStock() {
        this.initFormGroupDetAchatEtranger();
        if (this.formGroup.get('stockId')?.value > BigInt(0)) {
            let stock: Stock = this.listStock.find((e) => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            this.isValid = false;
            let isExistStock: boolean = false;

            this.listDetAchatEtranger.forEach((detAchatEtranger: DetAchatEtranger) => {
                if (detAchatEtranger.stockId === this.formGroup.get('stockId')?.value) {
                    isExistStock = true;

                    this.formGroup.patchValue({
                        stockId: BigInt(0)
                    });

                    return;
                }
            });

            if (!isExistStock) {
                this.detAchatEtranger.stockId = this.formGroup.get('stockId')?.value;
                this.detAchatEtranger.stock = stock;

                this.stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
                this.formGroupDetAchatEtranger.patchValue({
                    designation: this.stock.designation,
                    qteFacturer: this.stock.qteFacturer,
                    qteStockImport: this.stock.qteStockImport,
                    qteAchat: 1,
                    prixAchat: 0
                });

                this.formGroupDetAchatEtranger.get('designation')?.disable();
                this.formGroupDetAchatEtranger.get('qteFacturer')?.disable();
                this.formGroupDetAchatEtranger.get('qteStockImport')?.disable();
                this.isValid = true;

                this.formGroup.patchValue({
                    stockId: BigInt(0)
                });
            }

            this.openCloseDialogAjouterDetAchatEtranger(true);
        }
    }

    initDetAchatSimpleFormInformation() {
        this.stock = initObjectStock();
        this.formGroupDetAchatEtranger.patchValue({
            designation: '',
            qteFacturer: 0,
            qteStockImport: 0,
            qteAchat: 1,
            prixAchat: 0
        });
        this.formGroupDetAchatEtranger.get('designation')?.disable();
        this.formGroupDetAchatEtranger.get('qteFacturer')?.disable();
        this.formGroupDetAchatEtranger.get('qteStockImport')?.disable();
    }

    recuppererDetAchatEtranger(operation: number, detAchatEtrangerEdit: DetAchatEtranger) {
        if (detAchatEtrangerEdit && detAchatEtrangerEdit.stockId) {
            this.detAchatEtranger = structuredClone(detAchatEtrangerEdit);
            if (operation === 1) {
                this.openCloseDialogAjouterDetAchatEtranger(true);
            } else if (operation === 2) {
                this.openCloseDialogSupprimerDetAchatEtranger(true);
            }
        }
    }

    validerProduits() {
        this.detAchatEtranger.prixAchat = this.formGroupDetAchatEtranger.get('prixAchat')?.value;
        this.detAchatEtranger.qteAchat = this.formGroupDetAchatEtranger.get('qteAchat')?.value;

        this.listDetAchatEtranger.push(this.detAchatEtranger);
        this.detAchatEtranger = initObjectDetAchatEtranger();
        this.openCloseDialogAjouterDetAchatEtranger(false);
    }

    supprimerDetAchatEtranger() {
        this.listDetAchatEtranger = this.listDetAchatEtranger.filter((detAchatEtranger: DetAchatEtranger) => detAchatEtranger.stockId !== this.detAchatEtranger.stockId);
        this.formGroup.updateValueAndValidity();
        this.openCloseDialogSupprimerDetAchatEtranger(false);
    }

    openCloseDialogAjouter(openClose: boolean): void {
        this.dialogAjouter = openClose;
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    openCloseDialogAjouterDetAchatEtranger(openClose: boolean): void {
        this.dialogAjouterDetAchatEtranger = openClose;
    }

    openCloseDialogSupprimerDetAchatEtranger(openClose: boolean): void {
        this.dialogSupprimerDetAchatEtranger = openClose;
    }

    viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.listDetAchatEtranger = [];
        this.achatEtranger = initObjectAchatEtranger();
        this.initFormGroup();
    }

    getDesignation(id: number): string {
        return getElementFromMap(this.mapOfStock, id);
    }

    getDesignationFournisseur(id: number): string {
        return getElementFromMap(this.mapOfFournisseur, id);
    }

    getICE(id: number): string {
        return getElementFromMap(this.mapOfFournisseurICE, id);
    }

    getTypeReglement(typeReglement: number): string {
        let filteredTypeReglement = this.typeReglements.filter((type) => type.value === typeReglement);
        return filteredTypeReglement.length > 0 ? filteredTypeReglement[0].label : '';
    }

    calculerMntTotal(type: string) {
        let totlPye = 0.0;
        let allMntTotal = 0.0;

        if (type === 'mntDouane') {
            if (this.formGroup.get('mntDouane')?.value < 0) {
                this.formGroup.patchValue({ mntDouane: 0.0 });
            }
        }
        if (type === 'mntTransportIntern') {
            if (this.formGroup.get('mntTransportIntern')?.value < 0) {
                this.formGroup.patchValue({ mntTransportIntern: 0.0 });
            }
        }
        if (type === 'mntMagasinage') {
            if (this.formGroup.get('mntMagasinage')?.value < 0) {
                this.formGroup.patchValue({ mntMagasinage: 0.0 });
            }
        }
        if (type === 'mantantAvancs1') {
            if (this.formGroup.get('mantantAvancs1')?.value < 0) {
                this.formGroup.patchValue({ mantantAvancs1: 0.0 });
            }
        }
        if (type === 'mantantAvancs2') {
            if (this.formGroup.get('mantantAvancs2')?.value < 0) {
                this.formGroup.patchValue({ mantantAvancs2: 0.0 });
            }
        }

        if (this.formGroup.get('mantantAvancs1')?.value > 0) {
            totlPye += this.formGroup.get('mantantAvancs1')?.value;
        }
        if (this.formGroup.get('mantantAvancs2')?.value > 0) {
            totlPye += this.formGroup.get('mantantAvancs2')?.value;
        }

        if (this.formGroup.get('mntDouane')?.value > 0) {
            allMntTotal += this.formGroup.get('mntDouane')?.value;
        }
        if (this.formGroup.get('mntTransportIntern')?.value > 0) {
            allMntTotal += this.formGroup.get('mntTransportIntern')?.value;
        }
        if (this.formGroup.get('mntMagasinage')?.value > 0) {
            allMntTotal += this.formGroup.get('mntMagasinage')?.value;
        }

        allMntTotal += totlPye;

        this.formGroup.patchValue({ totalPaye: totlPye });
        this.formGroup.patchValue({ totalAllMnt: allMntTotal });

        this.formGroup.get('totalPaye')?.disable();
        this.formGroup.get('totalAllMnt')?.disable();
    }

    mapDateFromBackend(achatEtranger: AchatEtranger) {
        achatEtranger.sysDate = new Date(achatEtranger.sysDate + 'T00:00:00');
        achatEtranger.dateFacture = new Date(achatEtranger.dateFacture + 'T00:00:00');
        achatEtranger.dateAvances1 = new Date(achatEtranger.dateAvances1 + 'T00:00:00');
        achatEtranger.dateAvances2 = new Date(achatEtranger.dateAvances2 + 'T00:00:00');
    }

    recupperer(operation: number, achatEtrangerEdit: AchatEtranger) {
        if (achatEtrangerEdit && achatEtrangerEdit.id) {
            if (operation === 1) {
                this.achatEtrangerService.getByIdRequest(achatEtrangerEdit.id).subscribe({
                    next: (data: AchatEtrangerRequest) => {
                        this.achatEtranger = data.achatEtranger;
                        this.mapDateFromBackend(this.achatEtranger);
                        this.listDetAchatEtranger = data.detAchatEtrangers;
                        this.achatEtrangerAncien = structuredClone(data.achatEtranger);

                        this.listDetAchatEtranger.forEach((detAchatEtranger: DetAchatEtranger) => {
                            if (detAchatEtranger.stockId && detAchatEtranger.stockId !== BigInt(0)) {
                                let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detAchatEtranger.stockId) || initObjectStock();
                                detAchatEtranger.stock = stock;
                            }
                        });

                        this.formGroup.patchValue({
                            fournisseurId: this.achatEtranger.fournisseurId,
                            codeFacture: this.achatEtranger.codeFacture,
                            dateFacture: this.achatEtranger.dateFacture,
                            mntFacture: this.achatEtranger.mntFacture,
                            dateAvances1: this.achatEtranger.dateAvances1,
                            mantantAvancs1: this.achatEtranger.mantantAvancs1,
                            dateAvances2: this.achatEtranger.dateAvances2,
                            mantantAvancs2: this.achatEtranger.mantantAvancs2,
                            totalPaye: this.achatEtranger.totalPaye,
                            mntTransportIntern: this.achatEtranger.mntTransportIntern,
                            mntDouane: this.achatEtranger.mntDouane,
                            mntMagasinage: this.achatEtranger.mntMagasinage,
                            totalAllMnt: this.achatEtranger.totalAllMnt,
                            stockId: 0
                        });
                        this.formGroup.updateValueAndValidity();

                        this.formGroup.get('totalPaye')?.disable();
                        this.formGroup.get('totalAllMnt')?.disable();

                        this.openCloseDialogAjouter(true);
                    },
                    error: (error: any) => {
                        console.error(error);
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else if (operation === 2) {
                this.achatEtranger = structuredClone(achatEtrangerEdit);
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(achatEtranger: AchatEtranger, list: AchatEtranger[], operationType: OperationType, id?: bigint): AchatEtranger[] {
        if (operationType === OperationType.ADD) {
            list = [...list, achatEtranger];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === achatEtranger.id);
            if (index > -1) {
                list[index] = achatEtranger;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listAchatEtranger) {
            this.listAchatEtranger = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, achatEtranger: AchatEtranger): AchatEtranger {
        achatEtranger.fournisseurId = formGroup.get('fournisseurId')?.value;
        achatEtranger.dateAvances1 = toLocalDate(mapToDateTimeBackEnd(formGroup.get('dateAvances1')?.value));
        achatEtranger.dateAvances2 = toLocalDate(mapToDateTimeBackEnd(formGroup.get('dateAvances2')?.value));
        achatEtranger.dateFacture = toLocalDate(mapToDateTimeBackEnd(formGroup.get('dateFacture')?.value));
        achatEtranger.sysDate = mapToDateTimeBackEnd(achatEtranger.sysDate);
        achatEtranger.codeFacture = formGroup.get('codeFacture')?.value;
        achatEtranger.mntFacture = formGroup.get('mntFacture')?.value;
        achatEtranger.mantantAvancs1 = formGroup.get('mantantAvancs1')?.value;
        achatEtranger.mantantAvancs2 = formGroup.get('mantantAvancs2')?.value;
        achatEtranger.totalPaye = formGroup.get('totalPaye')?.value;
        achatEtranger.mntTransportIntern = formGroup.get('mntTransportIntern')?.value;
        achatEtranger.mntDouane = formGroup.get('mntDouane')?.value;
        achatEtranger.mntMagasinage = formGroup.get('mntMagasinage')?.value;
        achatEtranger.totalAllMnt = formGroup.get('totalAllMnt')?.value;

        return achatEtranger;
    }

    async checkIfExists(achatEtranger: AchatEtranger): Promise<boolean> {
        try {
            const existsObservable = this.achatEtrangerService.exist(achatEtranger).pipe(
                catchError((error) => {
                    console.error('Error in achatFacture existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if achatFacture exists:', error);
            return false;
        }
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let achatEtrangerEdit: AchatEtranger = { ...this.achatEtranger };
        this.mapFormGroupToObject(this.formGroup, achatEtrangerEdit);
        let trvErreur = false; // await this.checkIfExists(achatEtrangerEdit);

        if (!trvErreur) {
            this.achatEtranger = this.mapFormGroupToObject(this.formGroup, this.achatEtranger);
            this.listDetAchatEtranger.forEach((detAchatEtranger) => {
                detAchatEtranger.stock = null;
            });

            let achatEtrangerRequest: AchatEtrangerRequest = { achatEtranger: { ...this.achatEtranger }, detAchatEtrangers: this.listDetAchatEtranger };

            if (this.achatEtranger.id) {
                this.achatEtrangerService.update(this.achatEtranger.id, achatEtrangerRequest).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.listDetAchatEtranger = [];
                        this.checkIfListIsNull();
                        this.listAchatEtranger = this.updateList(data, this.listAchatEtranger, OperationType.MODIFY);
                        this.openCloseDialogAjouter(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: this.msg.summary.labelError,
                            detail: this.msg.messages.messageErrorProduite
                        });
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else {
                achatEtrangerRequest.achatEtranger.operateurId = BigInt(this.personnelCreationId || 0);
                this.achatEtrangerService.create(achatEtrangerRequest).subscribe({
                    next: (data: AchatEtranger) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.listDetAchatEtranger = [];
                        this.checkIfListIsNull();
                        this.listAchatEtranger = this.updateList(data, this.listAchatEtranger, OperationType.ADD);
                        this.openCloseDialogAjouter(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: this.msg.summary.labelError,
                            detail: this.msg.messages.messageErrorProduite
                        });
                    },
                    complete: () => {
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
        if (this.achatEtranger && this.achatEtranger.id) {
            this.loadingService.show();
            let id = this.achatEtranger.id;
            this.achatEtrangerService.delete(this.achatEtranger.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listAchatEtranger = this.updateList(initObjectAchatEtranger(), this.listAchatEtranger, OperationType.DELETE, id);
                    this.achatEtranger = initObjectAchatEtranger();
                },
                error: (err) => {
                    console.log(err);
                    this.loadingService.hide();
                    this.messageService.add({
                        severity: 'error',
                        summary: this.msg.summary.labelError,
                        detail: this.msg.messages.messageErrorProduite
                    });
                },
                complete: () => {
                    this.loadingService.hide();
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
        }

        this.openCloseDialogSupprimer(false);
    }
}
