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
import { DetAchatFacture, initObjectDetAchatFacture } from '@/models/det-achat-facture';
import { AchatFacture, initObjectAchatFacture } from '@/models/achat-facture';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { TypeSearch } from '@/shared/enums/type-search';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd, toLocalDate } from '@/shared/classes/generic-methods';
import { AchatFactureRequest } from '@/shared/classes/achat-facture-request';
import { AchatFactureService } from '@/services/achat-facture/achat-facture-service';
import { StockService } from '@/services/stock/stock-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { LoadingService } from '@/shared/services/loading-service';
import { OperationType } from '@/shared/enums/operation-type';
import { AchatFactureValidator } from '@/validators/achat-facture-validator';
import { filteredTypeReglement } from '@/shared/enums/type-reglement';
import { DetAchatFactureValidator } from '@/validators/det-achat-facture-validator';
import { catchError, firstValueFrom, of } from 'rxjs';
import { DetAchatFactureTVA, initObjectDetAchatFactureTVA } from '@/models/det-achat-facture-tva';
import { DetAchatFactureTVAValidator } from '@/validators/det-achat-facture-tva-validator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SumPipe } from '@/pipes/sum-pipe';

@Component({
    selector: 'app-achat-facture-component',
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
        InputTextModule,
        ConfirmDialogModule,
        SumPipe
    ],
    providers: [ConfirmationService],
    templateUrl: './achat-facture-component.html',
    styleUrl: './achat-facture-component.scss'
})
export class AchatFactureComponent {
    //Achat/BL
    //Buttons : Ajouter, Rechercher, Actualiser, Consulter
    //Tableau --> Fournisseur ---> Date | ICE | Date paiement |Paiement Type | Cheque N | N° Fature |  MT TTC | Actions
    //Ajouter --> Modal --> Fournisseur + ICE + N° Facture + Date Facture + Date Paiement + Paiement Type + Cheque N
    // || TVA7 Manuelle + TVA10 Manuelle + TVA12 Manuelle + TVA14 Manuelle + TVA20 Manuelle +  HT
    // || HT7 + HT10 + HT12 + HT14 + HT20 + HT + Total HT
    // || TVA7 + TVA10 + TVA12 + TVA14 + TVA20 + TVA + Total TVA
    // || TTC7 + TTC10 + TTC12 + TTC14 + TTC20 + Total TTC
    // Total MT Produit
    // || combo Produit + List Produits
    //Designation + St Facturé (qte facturé) + qte Acheté + uniteGratuite + Mt Produit + Action (delete)

    isValid: boolean = false;
    listStock: Stock[] = [];
    listAchatFacture: AchatFacture[] = [];
    listDetAchatFactureTVA: DetAchatFactureTVA[] = [];
    listDetAchatFacture: DetAchatFacture[] = [];
    listFournisseur: Fournisseur[] = [];
    achatFacture: AchatFacture = initObjectAchatFacture();
    achatFactureAncien: AchatFacture = initObjectAchatFacture();
    selectedAchatFacture!: AchatFacture;
    detAchatFacture: DetAchatFacture = initObjectDetAchatFacture();
    stock: Stock = initObjectStock();
    mapOfStock: Map<number, string> = new Map<number, string>();
    mapOfFournisseur: Map<number, string> = new Map<number, string>();
    mapOfFournisseurICE: Map<number, string> = new Map<number, string>();
    typeReglements: { label: string; value: number }[] = filteredTypeReglement;
    dialogSupprimer: boolean = false;
    dialogAjouterDetAchatFacture: boolean = false;
    dialogAjouterDetAchatFactureTVA: boolean = false;
    dialogSupprimerDetAchatFacture: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    formGroupDetAchatFacture!: FormGroup;
    formGroupDetAchatFactureTVA!: FormGroup;
    msg = APP_MESSAGES;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private achatFactureService: AchatFactureService,
        private stockService: StockService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private fournisseurService: FournisseurService,
        private confirmationService: ConfirmationService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.search();
        this.getAllStock();
        this.getAllFournisseur();
        this.initFormGroup();
        this.initFormGroupDetAchatFacture();
        this.initFormGroupDetAchatFactureTVA();
    }

    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    initFormGroupDetAchatFacture() {
        this.formGroupDetAchatFacture = this.formBuilder.group(
            {
                designation: [{ value: this.stock.designation, disabled: true }],
                qteFacturer: [{ value: this.stock.qteFacturer, disabled: true }],
                qteAcheter: [null, [Validators.required]],
                uniteGratuit: [null],
                remiseAchat: [null],
                prixAchatTtc: [null]
            },
            { validators: DetAchatFactureValidator({ stock: this.stock }) }
        );
    }

    initFormGroupDetAchatFactureTVA() {
        this.formGroupDetAchatFactureTVA = this.formBuilder.group(
            {
                taux: [null, [Validators.required, Validators.max(100)]],
                mntTVA: [null, [Validators.required]],
                mntHT: [null, [Validators.required]]
            },
            { validators: DetAchatFactureTVAValidator }
        );
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                stockId: [BigInt(0)],
                fournisseurId: [BigInt(0), [Validators.required, Validators.min(1)]],
                ice: [{ value: '', disabled: true }],
                numeroFacExterne: [''],
                dateAF: [new Date(), [Validators.required]],
                dateReglement: [new Date(), [Validators.required]],
                typeReglment: [0],
                numCheque: ['']
            },
            { validators: [AchatFactureValidator()] }
        );
    }

    search() {
        this.getAllAchatFacture();
    }

    getAllAchatFacture(): void {
        this.listAchatFacture = [];
        this.achatFactureService.getAll().subscribe({
            next: (data: AchatFacture[]) => {
                this.listAchatFacture = data;
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

    afficherProduitsAchatFac() {
        if (this.formGroup.get('stockId')?.value > BigInt(0)) {
            let stock: Stock = this.listStock.find((e) => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            this.detAchatFacture = initObjectDetAchatFacture();

            let existe: boolean = this.listDetAchatFacture.some((e) => e.stockId === this.formGroup.get('stockId')?.value);

            if (existe == false) {
                //this.detAchatFacture.remiseAchat = 0;
                this.detAchatFacture.qteAcheter = 0;
                this.detAchatFacture.uniteGratuit = 0;
                this.detAchatFacture.prixAchatHt = stock?.pahtGrossiste;
                this.detAchatFacture.prixVenteAchatHT = stock?.pvaht;

                //this.detAchatFacture.prixAchatTtc = stock?.pattc;
                this.detAchatFacture.prixVenteTtc = stock?.pvttc;
                this.detAchatFacture.benePourcentage = stock?.benifice;

                this.detAchatFacture.beneficeDH = stock?.pvttc - stock?.pattc;
                this.detAchatFacture.benePourcentage = stock?.benifice;
                this.detAchatFacture.stock = stock;
            }
        }
    }

    onChangeFournisseurId() {
        let fournisseurId: bigint = this.formGroup.get('fournisseurId')?.value;
        let ice: string = '';
        if (fournisseurId > BigInt(0)) {
            let fournisseur: Fournisseur = this.listFournisseur.find((e) => e.id === fournisseurId) || initObjectFournisseur();
            if (fournisseur && fournisseur.id !== BigInt(0)) {
                ice = fournisseur.ice;
            }
        }

        this.formGroup.patchValue({
            ice: ice
        });
    }

    onChangeIdStock() {
        this.initFormGroupDetAchatFacture();
        if (this.formGroup.get('stockId')?.value > BigInt(0)) {
            let stock: Stock = this.listStock.find((e) => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            this.isValid = false;
            let isExistStock: boolean = false;

            this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                if (detAchatFacture.stockId === this.formGroup.get('stockId')?.value) {
                    isExistStock = true;

                    this.formGroup.patchValue({
                        stockId: BigInt(0)
                    });

                    return;
                }
            });

            if (!isExistStock) {
                this.detAchatFacture.stockId = this.formGroup.get('stockId')?.value;

                //this.detAchatFacture.remiseAchat = 0.0;
                this.detAchatFacture.qteAcheter = 0;
                this.detAchatFacture.uniteGratuit = 0;
                this.detAchatFacture.prixAchatHt = stock.pahtGrossiste;
                this.detAchatFacture.prixVenteAchatHT = stock.pvaht;

                this.detAchatFacture.stockDesignation = stock.designation;
                this.detAchatFacture.stockQteFacturer = stock.qteFacturer;
                this.detAchatFacture.stockQteStock = stock.qteStock;

                //this.detAchatFacture.prixAchatTtc = stock.pattc;
                this.detAchatFacture.prixVenteTtc = stock.pvttc;
                this.detAchatFacture.benePourcentage = stock.benifice;

                this.detAchatFacture.beneficeDH = stock.pvttc - stock.pattc;
                this.detAchatFacture.stock = stock;

                this.stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
                this.formGroupDetAchatFacture.patchValue({
                    designation: this.stock.designation,
                    qteFacturer: this.stock.qteFacturer,
                    prixAchatTtc: null,
                    remiseAchat: null,
                    qteAcheter: null,
                    uniteGratuit: null
                });

                this.formGroupDetAchatFacture.get('designation')?.disable();
                this.formGroupDetAchatFacture.get('qteFacturer')?.disable();
                this.isValid = true;

                this.formGroup.patchValue({
                    stockId: BigInt(0)
                });
            }

            this.openCloseDialogAjouterDetAchatFacture(true);
        }
    }

    initDetAchatFactureFormInformation() {
        this.stock = initObjectStock();
        this.formGroupDetAchatFacture.patchValue({
            stockId: BigInt(0),
            qteStock: 0,
            prixAchatTtc: null,
            remiseAchat: null,
            uniteGratuit: null,
            qteAcheter: null,
            designation: ''
        });
        this.formGroupDetAchatFacture.get('designation')?.disable();
        this.formGroupDetAchatFacture.get('qteStock')?.disable();
    }

    recuppererDetAchatFacture(operation: number, detAchatFactureEdit: DetAchatFacture) {
        if (detAchatFactureEdit && detAchatFactureEdit.stockId) {
            this.detAchatFacture = structuredClone(detAchatFactureEdit);
            if (operation === 1) {
                this.openCloseDialogAjouter(true);
            } else if (operation === 2) {
                this.openCloseDialogSupprimerDetAchatFacture(true);
            }
        }
    }

    calculerTotal() {
        let mantantTTC: number = 0;
        if (this.listDetAchatFacture && this.listDetAchatFacture.length > 0) {
            this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                mantantTTC += detAchatFacture.mantantTTC;
            });
        }

        /*this.formGroup.patchValue({
            mantantTTC
        });*/
    }

    calculerMntTtc() {
        this.achatFacture.mntTtc = 0;
        if (this.listDetAchatFacture && this.listDetAchatFacture.length > 0) {
            let total = this.listDetAchatFacture.reduce((acc, detAchatFacture) => acc + detAchatFacture.mantantTTC, 0);
            this.achatFacture.mntTtc = total;
        }

        /*this.formGroup.patchValue({
            totalMntProduit: this.achatFacture.mntTtc
        });*/
    }

    validerProduits() {
        let prixAchatTtc: number = 0;
        let remiseAchat: number = 0;
        let qteachet: number = 0;
        let Totqqte: number = 0;
        let ug: number = 0;

        if (this.formGroupDetAchatFacture.get('qteAcheter')?.value > 0) {
            qteachet = this.formGroupDetAchatFacture.get('qteAcheter')?.value;
        }
        if (this.formGroupDetAchatFacture.get('uniteGratuit')?.value > 0) {
            ug = this.formGroupDetAchatFacture.get('uniteGratuit')?.value;
        }
        if (this.formGroupDetAchatFacture.get('prixAchatTtc')?.value > 0) {
            prixAchatTtc = this.formGroupDetAchatFacture.get('prixAchatTtc')?.value;
        }
        if (this.formGroupDetAchatFacture.get('remiseAchat')?.value > 0) {
            remiseAchat = this.formGroupDetAchatFacture.get('remiseAchat')?.value;
        }

        this.detAchatFacture.qteAcheter = qteachet;
        this.detAchatFacture.uniteGratuit = ug;
        this.detAchatFacture.prixAchatTtc = prixAchatTtc;
        this.detAchatFacture.remiseAchat = remiseAchat;
        this.detAchatFacture.mantantTTC = this.detAchatFacture.qteAcheter * this.detAchatFacture.prixAchatTtc;

        this.listDetAchatFacture = [...this.listDetAchatFacture, this.detAchatFacture];

        this.detAchatFacture = initObjectDetAchatFacture();

        this.achatFacture.tva20 = this.giveMeTotalMntTVA20(this.listDetAchatFacture);
        this.achatFacture.tva7 = this.giveMeTotalMntTVA7(this.listDetAchatFacture);

        this.calculerMntTtc();
        this.openCloseDialogAjouterDetAchatFacture(false);
    }

    calculerMontProd() {
        let prv = 0.0;
        let prattc = 0.0;
        let qteLivr = 0;
        let rmiseLivr = 0.0;
        let mntPro = 0.0;

        if (this.detAchatFacture.prixVenteTtc > 0.0) {
            prv = this.detAchatFacture.prixVenteTtc;
        }
        if (this.formGroupDetAchatFacture.get('prixAchatTtc')?.value > 0) {
            prattc = this.formGroupDetAchatFacture.get('prixAchatTtc')?.value;
        }
        /*if (this.detAchatFacture.prixAchatTtc > 0.0) {
            prattc = this.detAchatFacture.prixAchatTtc;
        }*/
        if (this.formGroupDetAchatFacture.get('qteAcheter')?.value > 0) {
            qteLivr = this.formGroupDetAchatFacture.get('qteAcheter')?.value;
        }
        if (this.formGroupDetAchatFacture.get('remiseAchat')?.value > 0) {
            rmiseLivr = this.formGroupDetAchatFacture.get('remiseAchat')?.value;
        }
        /*if (this.detAchatFacture.remiseAchat > 0) {
            rmiseLivr = this.detAchatFacture.remiseAchat;
        }*/

        if (this.formGroupDetAchatFacture.get('remiseAchat')?.value == 0.0 && this.formGroupDetAchatFacture.get('uniteGratuit')?.value == 0) {
            mntPro = prattc * qteLivr - (prattc * qteLivr * rmiseLivr) / 100;
        } else {
            mntPro = prv * qteLivr - (prv * qteLivr * rmiseLivr) / 100;
        }

        this.detAchatFacture.mantantTTC = mntPro;
        if (this.detAchatFacture.stock?.tva === 7) {
            let tv7 = 1.07;
            let prhht = this.detAchatFacture.mantantTTC / tv7;
            this.detAchatFacture.mantantHt = prhht;
            this.detAchatFacture.tva7 = this.detAchatFacture.mantantTTC - this.detAchatFacture.mantantHt;
            this.detAchatFacture.tva20 = 0.0;
        } else {
            let tv20 = 1.2;
            let prhht = this.detAchatFacture.mantantTTC / tv20;
            this.detAchatFacture.mantantHt = prhht;
            this.detAchatFacture.tva20 = this.detAchatFacture.mantantTTC - this.detAchatFacture.mantantHt;
            this.detAchatFacture.tva7 = 0.0;
        }
    }

    giveMeTotalMntHT(listDetAchatFacture: DetAchatFacture[]): number {
        let mntp = 0.0;
        for (let detAchatFactures of listDetAchatFacture) {
            mntp += detAchatFactures.mantantHt;
        }
        return mntp;
    }

    giveMeTotalMntTTc(listDetAchatFacture: DetAchatFacture[]): number {
        let mntp = 0.0;
        for (let detAchatFactures of listDetAchatFacture) {
            mntp += detAchatFactures.mantantTTC;
        }
        return mntp;
    }

    giveMeTotalMntTVA7(listDetAchatFacture: DetAchatFacture[]): number {
        let mntp = 0.0;
        for (let detAchatFactures of listDetAchatFacture) {
            mntp += detAchatFactures.tva7;
        }
        return mntp;
    }

    giveMeTotalMntTVA20(listDetachatfacture: DetAchatFacture[]): number {
        let mntp = 0.0;
        for (let detAchatFactures of listDetachatfacture) {
            mntp += detAchatFactures.tva20;
        }
        return mntp;
    }

    validerDetAchatFacture() {
        if (this.formGroup.get('stockId')?.value > BigInt(0) && this.formGroupDetAchatFacture.get('qteAcheter')?.value > 0) {
            let detAchatFacture: DetAchatFacture = initObjectDetAchatFacture();
            detAchatFacture.stockId = this.formGroup.get('stockId')?.value;
            detAchatFacture.qteAcheter = this.formGroupDetAchatFacture.get('qteAcheter')?.value;
            detAchatFacture.uniteGratuit = this.formGroupDetAchatFacture.get('uniteGratuit')?.value || 0;
            detAchatFacture.prixAchatTtc = this.formGroupDetAchatFacture.get('prixAchatTtc')?.value || 0;
            detAchatFacture.remiseAchat = this.formGroupDetAchatFacture.get('remiseAchat')?.value || 0;

            let stock: Stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
            detAchatFacture.stockDesignation = stock.designation;
            detAchatFacture.stockPvttc = stock.pvttc;
            detAchatFacture.stockQteStock = stock.qteStock;
            detAchatFacture.stockQteFacturer = stock.qteFacturer;

            this.listDetAchatFacture = [...this.listDetAchatFacture, detAchatFacture];

            this.initDetAchatFactureFormInformation();
            this.calculerTotal();
        }
    }

    supprimerDetAchatFacture() {
        this.listDetAchatFacture = this.listDetAchatFacture.filter((detAchatFacture: DetAchatFacture) => detAchatFacture.stockId !== this.detAchatFacture.stockId);
        this.calculerTotal();
        this.calculerMntTtc();
        this.formGroup.updateValueAndValidity();
        this.openCloseDialogSupprimerDetAchatFacture(false);
    }

    openCloseDialogAjouter(openClose: boolean): void {
        this.dialogAjouter = openClose;
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    openCloseDialogAjouterDetAchatFacture(openClose: boolean): void {
        this.dialogAjouterDetAchatFacture = openClose;
    }

    openCloseDialogSupprimerDetAchatFacture(openClose: boolean): void {
        this.dialogSupprimerDetAchatFacture = openClose;
    }

    openCloseDialogAjouterDetAchatFactureTVA(openClose: boolean): void {
        this.dialogAjouterDetAchatFactureTVA = openClose;
    }

    async getLastNumAchatFacture(): Promise<number> {
        let numAchat: number = 0;

        this.achatFactureService.getLastNumAchat(this.achatFacture).subscribe({
            next: (data: number) => {
                numAchat = data;
            }
        });

        return numAchat;
    }

    generateNumAchat(achatFacture: AchatFacture): string {
        let codbl = achatFacture.numAchat + '';
        let codeBLe = '';
        if (codbl.length == 1) {
            codeBLe = 'A000' + achatFacture.numAchat;
        } else if (codbl.length == 2) {
            codeBLe = 'A00' + achatFacture.numAchat;
        }
        if (codbl.length >= 3) {
            codeBLe = 'A0' + achatFacture.numAchat;
        }

        return codeBLe;
    }

    async viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.listDetAchatFacture = [];
        this.listDetAchatFactureTVA = [];
        this.achatFacture = initObjectAchatFacture();
        this.achatFactureAncien = initObjectAchatFacture();
        let numAchat: number = await this.getLastNumAchatFacture();
        this.achatFacture.numAchat = numAchat;
        this.achatFacture.codeAF = this.generateNumAchat(this.achatFacture);
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

    mapDateFromBackend(achatFacture: AchatFacture) {
        achatFacture.dateAF = new Date(achatFacture.dateAF + 'T00:00:00');
        achatFacture.dateReglement = new Date(achatFacture.dateReglement + 'T00:00:00');
    }

    recupperer(operation: number, achatFactureEdit: AchatFacture) {
        if (achatFactureEdit && achatFactureEdit.id) {
            if (operation === 1) {
                this.achatFactureService.getByIdRequest(achatFactureEdit.id).subscribe({
                    next: (data: AchatFactureRequest) => {
                        this.achatFacture = data.achatFacture;
                        this.mapDateFromBackend(this.achatFacture);
                        this.listDetAchatFacture = data.detAchatFactures;
                        this.listDetAchatFactureTVA = data.detAchatFactureTVA;
                        this.achatFactureAncien = structuredClone(data.achatFacture);

                        this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                            if (detAchatFacture.stockId && detAchatFacture.stockId !== BigInt(0)) {
                                let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detAchatFacture.stockId) || initObjectStock();
                                detAchatFacture.stock = stock;
                            }
                        });

                        let fournisseur: Fournisseur = this.listFournisseur.find((fournisseur: Fournisseur) => fournisseur.id === this.achatFacture.fournisseurId) || initObjectFournisseur();

                        this.formGroup.patchValue({
                            fournisseurId: this.achatFacture.fournisseurId,
                            ice: fournisseur.ice,
                            numeroFacExterne: this.achatFacture.numeroFacExterne,
                            dateAF: this.achatFacture.dateAF,
                            dateReglement: this.achatFacture.dateReglement,
                            typeReglment: this.achatFacture.typeReglment,
                            numCheque: this.achatFacture.numCheque
                        });
                        this.formGroup.updateValueAndValidity();

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
                this.achatFacture = structuredClone(achatFactureEdit);
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(achatFacture: AchatFacture, list: AchatFacture[], operationType: OperationType, id?: bigint): AchatFacture[] {
        if (operationType === OperationType.ADD) {
            list = [...list, achatFacture];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === achatFacture.id);
            if (index > -1) {
                list[index] = achatFacture;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listAchatFacture) {
            this.listAchatFacture = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, achatFacture: AchatFacture): AchatFacture {
        achatFacture.fournisseurId = formGroup.get('fournisseurId')?.value;
        achatFacture.dateAF = toLocalDate(mapToDateTimeBackEnd(formGroup.get('dateAF')?.value));
        achatFacture.dateReglement = toLocalDate(mapToDateTimeBackEnd(formGroup.get('dateReglement')?.value));
        achatFacture.sysDate = mapToDateTimeBackEnd(achatFacture.sysDate);
        achatFacture.numeroFacExterne = formGroup.get('numeroFacExterne')?.value;
        achatFacture.typeReglment = formGroup.get('typeReglment')?.value;
        achatFacture.numCheque = formGroup.get('numCheque')?.value;

        return achatFacture;
    }

    async checkIfExists(achatFacture: AchatFacture): Promise<boolean> {
        try {
            const existsObservable = this.achatFactureService.exist(achatFacture).pipe(
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
        let achatFactureEdit: AchatFacture = { ...this.achatFacture };
        this.mapFormGroupToObject(this.formGroup, achatFactureEdit);
        let trvErreur = await this.checkIfExists(achatFactureEdit);

        if (!trvErreur) {
            this.achatFacture = this.mapFormGroupToObject(this.formGroup, this.achatFacture);
            this.listDetAchatFacture.forEach((detAchatFacture) => {
                detAchatFacture.stock = null;
            });

            let achatFactureRequest: AchatFactureRequest = { achatFacture: { ...this.achatFacture }, detAchatFactures: this.listDetAchatFacture, detAchatFactureTVA: this.listDetAchatFactureTVA };

            if (this.achatFacture.id) {
                this.achatFactureService.update(this.achatFacture.id, achatFactureRequest).subscribe({
                    next: (data) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });

                        this.listDetAchatFacture = [];
                        this.checkIfListIsNull();
                        this.listAchatFacture = this.updateList(data, this.listAchatFacture, OperationType.MODIFY);
                        this.openCloseDialogAjouter(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else {
                this.achatFactureService.create(achatFactureRequest).subscribe({
                    next: (data: AchatFacture) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });

                        this.listDetAchatFacture = [];
                        this.checkIfListIsNull();
                        this.listAchatFacture = this.updateList(data, this.listAchatFacture, OperationType.ADD);
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
        if (this.achatFacture && this.achatFacture.id) {
            this.loadingService.show();
            let id = this.achatFacture.id;
            this.achatFactureService.delete(this.achatFacture.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listAchatFacture = this.updateList(initObjectAchatFacture(), this.listAchatFacture, OperationType.DELETE, id);
                    this.achatFacture = initObjectAchatFacture();
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

    /***************************************** DetAchatFactureTVA ***************************************/

    viderAjouterDetAchatFactureTVA() {
        this.initFormGroupDetAchatFactureTVA();
        this.openCloseDialogAjouterDetAchatFactureTVA(true);
    }

    mapFormGroupToObjectDetAchatFactureTVA(detAchatFactureTVA: DetAchatFactureTVA): DetAchatFactureTVA {
        detAchatFactureTVA.mntHT = this.formGroupDetAchatFactureTVA.value.mntHT;
        detAchatFactureTVA.mntTVA = this.formGroupDetAchatFactureTVA.value.mntTVA;
        detAchatFactureTVA.taux = this.formGroupDetAchatFactureTVA.value.taux;

        detAchatFactureTVA.mntTTC = this.formGroupDetAchatFactureTVA.value.mntHT + this.formGroupDetAchatFactureTVA.value.mntTVA;
        return detAchatFactureTVA;
    }

    ajouterDetAchatFactureTVA() {
        let detAchatFactureTVA = this.mapFormGroupToObjectDetAchatFactureTVA(initObjectDetAchatFactureTVA());
        this.listDetAchatFactureTVA = [...this.listDetAchatFactureTVA, detAchatFactureTVA];
        this.openCloseDialogAjouterDetAchatFactureTVA(false);
    }

    supprimerDetAchatFactureTVA(event: Event, index: number) {
        console.log('index', index, 'event', event);
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: this.msg.messages.messageDeleteConfirm,
            header: this.msg.messages.confirmation,
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: this.msg.summary.labelCancel,
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: this.msg.summary.labelSave
            },
            accept: () => {
                if (index > -1 && index < this.listDetAchatFactureTVA.length) {
                    this.listDetAchatFactureTVA = this.listDetAchatFactureTVA.slice(0, index).concat(this.listDetAchatFactureTVA.slice(index + 1));
                }
                this.messageService.add({ severity: 'info', summary: this.msg.summary.labelInfo, detail: this.msg.messages.messageDeleteSuccess });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.msg.summary.labelError,
                    detail: this.msg.messages.messageDeleteCancel,
                    life: 3000
                });
            }
        });
    }
}
