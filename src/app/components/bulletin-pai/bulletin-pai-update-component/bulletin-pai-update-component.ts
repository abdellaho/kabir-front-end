import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@/shared/services/data-service';
import { Router } from '@angular/router';
import { Facture, initObjectFacture } from '@/models/bulletinPai';
import { DetFacture, initObjectDetFacture } from '@/models/det-bulletinPai';
import { Subscription, concatMap, delay, from } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { FactureService } from '@/services/bulletinPai/bulletinPai-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initObjectStock, Stock } from '@/models/stock';
import { StockService } from '@/services/stock/stock-service';
import { ajusterMontantsFacture, getPrixVenteMin, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { OperationType } from '@/shared/enums/operation-type';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { filteredTypeReglement } from '@/shared/enums/type-reglement';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Etablissement, initObjectEtablissement } from '@/models/etablissement';
import { EtablissementService } from '@/services/etablissement/etablissement-service';
import { BulletinPai, initObjectBulletinPai } from '@/models/bulletin-pai';
import { DetBulletinPai } from '@/models/det-bulletin-pai';
import { BulletinPaiService } from '@/services/bulletin-pai/bulletin-pai-service';
import { DetBulletinLivraison } from '@/models/det-bulletin-livraison';

@Component({
    selector: 'app-bulletin-pai-update-component',
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
        InputTextModule,
        DatePickerModule,
        SelectModule,
        IconFieldModule,
        ToggleSwitchModule,
        CheckboxModule,
        MessageModule,
        MultiSelectModule
    ],
    templateUrl: './bulletin-pai-update-component.html',
    styleUrl: './bulletin-pai-update-component.scss'
})
export class BulletinPaiUpdateComponent implements OnInit, OnDestroy {
    //listDetbultinpai  --> designation + qtevendu, commission(prixCommercial disabled if > 0), mantantVendu, mntReel(typ.qtevendu * typ.prixvente)
    //style="#{typ.mantantvendu==0 ? 'background-color:yellow;' : '', 
    // Taux(disabled="#{typ.prixCommercial > 0}" value="#{typ.commission}" style="#{typ.commission==0 ? 'background-color:yellow; width : 90%;':'width : 90%;'}") listener="#{bulttinPaiActionBeans.calculerCommissionNew()}"
    // commsiondh, primeProduit, primeCommercial

    //listDetbultinpaiZero --> produitGratuit(Designation) + qtevendu
    //listDetbultinlivraison --> #{msg.date}livraison.dateBl, #{msg.numBL}livraison.codeBl, #{msg.Client}livraison.repertoireByClient.designation, 
    // #{msg.mtVenddue}livraison.mantantBL, #{typ.livraison.reglerNonRegler}
    //<p:column style="width: 30px;" rendered="#{bulttinPaiActionBeans.utilisateurConnecte.typeUser eq 1}">
									//<p:commandLink action="#{bulttinPaiActionBeans.remove(typ)}" update=":form:idListRepStock :form:idListRepStockZero :form:idListRep :form:primeCommercial :form:tot :form:ttMntVend :form:msg" title="#{msg.bntSupprimer}" style="color: red; font-size: 1.5em;">
										//<i class="fa fa-trash"></i>
									//</p:commandLink>
								//</p:column>
    personnelCreationId: number | null = null;
    submitted: boolean = false;
    etablissement: Etablissement = initObjectEtablissement();
    bulletinPai: BulletinPai = initObjectBulletinPai();
    listDetBulletinPai: DetBulletinPai[] = [];
    listDetBulletinLivraison: DetBulletinLivraison[] = [];
    listPersonnel: Personnel[] = [];
    listStock: Stock[] = [];
    mapOfPersonnels: Map<number, string> = new Map<number, string>();
    mapOfStocks: Map<number, string> = new Map<number, string>();
    subscription!: Subscription;
    dialogStock: boolean = false;
    dialogFacturer: boolean = false;
    dialogRegler: boolean = false;
    dialogDeleteStock: boolean = false;
    detFactureSelected: DetFacture = initObjectDetFacture();
    stockSelected: Stock = initObjectStock();
    msg = APP_MESSAGES;
    formGroup!: FormGroup;
    formGroupStock!: FormGroup;
    typeReglements: { label: string; value: number }[] = filteredTypeReglement;

    constructor(
        private bulletinPaiService: BulletinPaiService,
        private stockService: StockService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private router: Router,
        private messageService: MessageService,
        private etablissementService: EtablissementService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.submitted = false;
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.initFormGroupStock();
        this.initFormGroup();

        this.subscription = this.dataService.currentBulletinPai$.subscribe((data) => {
            if (!data) {
                this.router.navigate(['/bulletinPai']);
                return;
            }
            this.getEtablissement();
            this.bulletinPai = this.adjustBulletinPai(data.bulletinPai);
            this.listDetBulletinPai = data.detBulletinPais;
            this.listDetBulletinLivraison = data.detBulletinLivraisons;
            this.listPersonnel = [initObjectPersonnel(), ...data.listPersonnel];
            this.mapOfPersonnels = this.listPersonnel.reduce((map, personnel) => map.set(Number(personnel.id), personnel.designation), new Map<number, string>());
            this.listStock = [initObjectStock(), ...data.listStock];
            this.mapOfStocks = this.listStock.reduce((map, stock) => map.set(Number(stock.id), stock.designation), new Map<number, string>());
            this.mapObjectToFormGroup(this.bulletinPai);
            this.adjustDetBulletinPai();
        });
    }

    getEtablissement() {
        this.etablissementService.getAll().subscribe({
            next: (data: Etablissement[]) => {
                this.etablissement = data[0];
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    adjustBulletinPai(bulletinPai: BulletinPai): BulletinPai {
        bulletinPai.dateDebut = new Date(bulletinPai.dateDebut);
        bulletinPai.dateFin = new Date(bulletinPai.dateFin);

        return bulletinPai;
    }

    adjustDetBulletinPai() {
        this.listDetBulletinPai.forEach((detBulletinPai: DetBulletinPai) => {
            detBulletinPai.stock = this.listStock.find((stock) => stock.id === detBulletinPai.produitId) || initObjectStock();
        });
        this.formGroup.patchValue({
            detFactures: this.listDetBulletinPai
        });
    }

    mapObjectToFormGroup(bulletinPai: BulletinPai) {
        this.formGroup.patchValue({
            numBulletin: bulletinPai.numBulletin,
            codeBulletin: bulletinPai.codeBulletin,
            dateDebut: bulletinPai.dateDebut,
            dateFin: bulletinPai.dateFin,
            personnelId: bulletinPai.commercialId,
            totalMntVendue
            totalMntVenduePrixCommercial
            totalMntVendueSansPrixCommercial
            frais
            salairefx
            primeSpecial
            primeProduit
            primeCommercial
            mntCNSS
            total
            fraisSupp

        });
        this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetBulletinPai is set
    }

    initFormGroupStock() {
        this.formGroupStock = this.formBuilder.group(
            {
                designation: [{ value: this.stockSelected.designation, disabled: true }],
                pattc: [{ value: this.stockSelected.pattc, disabled: true }],
                pvttc: [{ value: this.stockSelected.pvttc, disabled: true }],
                qteStock: [{ value: this.stockSelected.qteFacturer, disabled: true }],
                prixVenteMin: [{ value: getPrixVenteMin(this.stockSelected), disabled: true }],
                qteFacturer: [1, [Validators.required, Validators.min(1)]],
                prixVente: [this.stockSelected.pvttc, [Validators.min(0)]],
                remiseFacture: [0, [Validators.min(0), Validators.max(100)]],
                montantProduit: [0, [Validators.min(0)]]
            },
            { validators: DetFactureValidator({ stock: this.stockSelected }) }
        );
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                numFacture: [0],
                codeBF: [{ value: '', disabled: true }, [Validators.required]],
                dateBF: [new Date(), [Validators.required]],
                dateReglement: [new Date(), [Validators.required]],
                dateReglement2: [null],
                dateReglement3: [null],
                dateReglement4: [null],
                typeReglment: [0],
                typeReglment2: [0],
                typeReglment3: [0],
                typeReglment4: [0],
                numCheque: [''],
                numCheque2: [''],
                numCheque3: [''],
                numCheque4: [''],
                numRemise: [''],
                numRemise2: [''],
                numRemise3: [''],
                numRemise4: [''],
                mantantBL: [0],
                mntReglement: [0],
                mntReglement2: [0],
                mntReglement3: [0],
                mntReglement4: [0],
                personnelId: [0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }],
                repertoireId: [0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }],
                stockId: [0],
                repertoireDesignation: [{ value: '', disabled: true }],
                repertoireAdresse: [{ value: '', disabled: true }],
                repertoireTel1: [{ value: '', disabled: true }],
                repertoireTel2: [{ value: '', disabled: true }],
                repertoireICE: [{ value: '', disabled: true }]
            },
            { validators: FactureValidator({ getListDetFacture: () => this.listDetBulletinPai }) }
        );
    }

    calculTotal() {
    }

    calculerPrimeCommercial() {

    }

    calculerCommissionNew() {

    }

    mapFormToFacture() {
        this.bulletinPai.numFacture = this.formGroup.get('numFacture')?.value;
        this.bulletinPai.codeBF = this.formGroup.get('codeBF')?.value;
        this.bulletinPai.dateBF = this.formGroup.get('dateBF')?.value;
        this.bulletinPai.dateReglement = this.formGroup.get('dateReglement')?.value;
        this.bulletinPai.dateReglement2 = this.formGroup.get('dateReglement2')?.value;
        this.bulletinPai.dateReglement3 = this.formGroup.get('dateReglement3')?.value;
        this.bulletinPai.dateReglement4 = this.formGroup.get('dateReglement4')?.value;
        this.bulletinPai.typeReglment = this.formGroup.get('typeReglment')?.value;
        this.bulletinPai.typeReglment2 = this.formGroup.get('typeReglment2')?.value;
        this.bulletinPai.typeReglment3 = this.formGroup.get('typeReglment3')?.value;
        this.bulletinPai.typeReglment4 = this.formGroup.get('typeReglment4')?.value;
        this.bulletinPai.numCheque = this.formGroup.get('numCheque')?.value;
        this.bulletinPai.numCheque2 = this.formGroup.get('numCheque2')?.value;
        this.bulletinPai.numCheque3 = this.formGroup.get('numCheque3')?.value;
        this.bulletinPai.numCheque4 = this.formGroup.get('numCheque4')?.value;
        this.bulletinPai.numRemise = this.formGroup.get('numRemise')?.value;
        this.bulletinPai.numRemise2 = this.formGroup.get('numRemise2')?.value;
        this.bulletinPai.numRemise3 = this.formGroup.get('numRemise3')?.value;
        this.bulletinPai.numRemise4 = this.formGroup.get('numRemise4')?.value;
        this.bulletinPai.mantantBF = this.formGroup.get('mantantBF')?.value;
        this.bulletinPai.mntReglement = this.formGroup.get('mntReglement')?.value;
        this.bulletinPai.mntReglement2 = this.formGroup.get('mntReglement2')?.value;
        this.bulletinPai.mntReglement3 = this.formGroup.get('mntReglement3')?.value;
        this.bulletinPai.mntReglement4 = this.formGroup.get('mntReglement4')?.value;
        this.bulletinPai.personnelId = this.formGroup.get('personnelId')?.value;
        this.bulletinPai.repertoireId = this.formGroup.get('repertoireId')?.value;
    }

    openCloseDialogStock(openClose: boolean): void {
        this.dialogStock = openClose;
    }

    openCloseDialogDeleteStock(openClose: boolean): void {
        this.dialogDeleteStock = openClose;
    }

    disableRepertoireData() {
        this.formGroup.get('repertoireDesignation')?.disable();
        this.formGroup.get('repertoireAdresse')?.disable();
        this.formGroup.get('repertoireTel1')?.disable();
        this.formGroup.get('repertoireTel2')?.disable();
        this.formGroup.get('repertoireICE')?.disable();
    }

    onChangeIdRepertoire() {
        this.repertoireSelected = this.listRepertoire.find((repertoire) => repertoire.id === this.formGroup.get('repertoireId')?.value) || initObjectRepertoire();

        if (this.repertoireSelected && this.repertoireSelected.id !== null && this.repertoireSelected.id !== undefined) {
            this.formGroup.patchValue({
                repertoireDesignation: this.repertoireSelected.designation,
                repertoireAdresse: this.repertoireSelected.adresse,
                repertoireTel1: this.repertoireSelected.tel1,
                repertoireTel2: this.repertoireSelected.tel2,
                repertoireICE: this.repertoireSelected.ice
            });

            this.disableRepertoireData();
        } else {
            this.formGroup.patchValue({
                repertoireDesignation: '',
                repertoireAdresse: '',
                repertoireTel1: '',
                repertoireTel2: '',
                repertoireICE: ''
            });

            this.disableRepertoireData();
        }
    }

    onChangeIdStock() {
        this.detFactureSelected = this.listDetBulletinPai.find((detFacture) => detFacture.stockId === this.formGroup.get('stockId')?.value) || initObjectDetFacture();
        this.stockSelected = this.listStock.find((stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();

        if (this.stockSelected.id !== null && this.stockSelected.id !== undefined) {
            if (this.detFactureSelected.stockId === null) {
                this.detFactureSelected.stockId = this.stockSelected.id;
            }

            this.initFormGroupStock();
            this.onChangeMontantProduit();
            this.openCloseDialogStock(true);
        }
    }

    mapFormGroupStockToObject(formGroup: FormGroup, detailFacture: DetFacture): DetFacture {
        detailFacture.stock = structuredClone(this.stockSelected);
        detailFacture.prixVente = formGroup.get('prixVente')?.value;
        detailFacture.qteFacturer = formGroup.get('qteFacturer')?.value;
        detailFacture.remiseFacture = formGroup.get('remiseFacture')?.value;
        detailFacture.montantProduit = formGroup.get('montantProduit')?.value;

        return detailFacture;
    }

    updateList(detailFacture: DetFacture, list: DetFacture[], operationType: OperationType, stockId?: bigint): DetFacture[] {
        if (operationType === OperationType.ADD) {
            list = [...list, detailFacture];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.stockId === detailFacture.stockId);
            if (index > -1) {
                list[index] = structuredClone(detailFacture);
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.stockId !== stockId);
        }
        return list;
    }

    recuppererDetFacture(operation: number, detFactureEdit: DetFacture) {
        if (detFactureEdit && detFactureEdit.stockId) {
            this.detFactureSelected = structuredClone(detFactureEdit);
            if (operation === 1) {
                this.initFormGroupStock();
                this.stockSelected = this.listStock.find((x) => x.id === this.detFactureSelected.stockId) || initObjectStock();
                this.detFactureSelected.stock = structuredClone(this.stockSelected);

                this.formGroupStock.patchValue({
                    designation: this.stockSelected.designation,
                    pattc: this.stockSelected.pattc,
                    pvttc: this.stockSelected.pvttc,
                    qteStock: this.stockSelected.qteStock,
                    prixVenteMin: getPrixVenteMin(this.stockSelected),
                    prixVente: this.detFactureSelected.prixVente,
                    qteFacturer: this.detFactureSelected.qteFacturer,
                    remiseFacture: this.detFactureSelected.remiseFacture,
                    montantProduit: this.detFactureSelected.montantProduit
                });

                this.formGroupStock.get('designation')?.disable();
                this.formGroupStock.get('pattc')?.disable();
                this.formGroupStock.get('pvttc')?.disable();
                this.formGroupStock.get('qteStock')?.disable();
                this.formGroupStock.get('prixVenteMin')?.disable();
                this.formGroupStock.get('montantProduit')?.disable();

                this.openCloseDialogStock(true);
            } else {
                this.openCloseDialogDeleteStock(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    onChangeMontantProduit() {
        this.formGroupStock.patchValue({
            montantProduit: this.formGroupStock.get('prixVente')?.value * this.formGroupStock.get('qteFacturer')?.value
        });
    }

    validerStock() {
        console.log(this.detFactureSelected);
        let updatedDetFacture = structuredClone(this.detFactureSelected);

        updatedDetFacture = this.mapFormGroupStockToObject(this.formGroupStock, updatedDetFacture);

        if (updatedDetFacture.stockId) {
            let exist: boolean = this.listDetBulletinPai.some((detFacture: DetFacture) => detFacture.stockId === updatedDetFacture.stockId);

            if (exist) {
                this.listDetBulletinPai = this.updateList(updatedDetFacture, this.listDetBulletinPai, OperationType.MODIFY, updatedDetFacture.stockId);
            } else {
                this.listDetBulletinPai = this.updateList(updatedDetFacture, this.listDetBulletinPai, OperationType.ADD);
            }
        }

        this.calculerMontantTotal();
        this.stockSelected = initObjectStock();
        this.formGroup.patchValue({ stockId: null });
        this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetBulletinPai changes
        this.openCloseDialogStock(false);
    }

    recupperer(operation: number, detFactureEdit: DetFacture) {
        if (detFactureEdit && detFactureEdit.stockId) {
            this.detFactureSelected = structuredClone(detFactureEdit);
            if (operation === 1) {
                this.formGroupStock.patchValue({
                    designation: this.detFactureSelected.stock?.designation,
                    pattc: this.detFactureSelected.stock?.pattc,
                    qteStock: this.detFactureSelected.stock?.qteStock,
                    qteFacturer: this.detFactureSelected.qteFacturer,
                    prixVente: this.detFactureSelected.prixVente,
                    remiseFacture: this.detFactureSelected.remiseFacture
                });
                this.openCloseDialogStock(true);
            } else if (operation === 2) {
                this.openCloseDialogDeleteStock(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    getReglementDataFromFormGroup(bulletinPai: Facture, formGroup: FormGroup) {
        bulletinPai.dateReglement = formGroup.get('dateReglement')?.value;
        bulletinPai.dateReglement2 = formGroup.get('dateReglement2')?.value;
        bulletinPai.dateReglement3 = formGroup.get('dateReglement3')?.value;
        bulletinPai.dateReglement4 = formGroup.get('dateReglement4')?.value;
        bulletinPai.mntReglement = formGroup.get('mntReglement')?.value;
        bulletinPai.mntReglement2 = formGroup.get('mntReglement2')?.value;
        bulletinPai.mntReglement3 = formGroup.get('mntReglement3')?.value;
        bulletinPai.mntReglement4 = formGroup.get('mntReglement4')?.value;
    }

    patchMontantReglement(bulletinPai: Facture, formGroup: FormGroup) {
        formGroup.patchValue({
            mntReglement: bulletinPai.mntReglement,
            mntReglement2: bulletinPai.mntReglement2,
            mntReglement3: bulletinPai.mntReglement3,
            mntReglement4: bulletinPai.mntReglement4
        });
    }

    calculerMontantTotal() {
        this.bulletinPai.mantantBF = this.listDetBulletinPai.reduce((total: number, detFacture: DetFacture) => total + Number(detFacture.montantProduit), 0);
        this.formGroup.get('mantantBF')?.setValue(this.bulletinPai.mantantBF);
        this.getReglementDataFromFormGroup(this.bulletinPai, this.formGroup);
        this.bulletinPai = ajusterMontantsFacture(this.bulletinPai, this.bulletinPai.mantantBF);
        this.patchMontantReglement(this.bulletinPai, this.formGroup);
    }

    deleteDetFacture() {
        let stockId: bigint = this.detFactureSelected?.stockId || 0n;
        this.listDetBulletinPai = this.updateList(this.detFactureSelected, this.listDetBulletinPai, OperationType.DELETE, stockId);
        this.calculerMontantTotal();
        this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetBulletinPai changes
        this.openCloseDialogDeleteStock(false);
    }

    mapFormGroupToObject(formGroup: FormGroup, bulletinPai: Facture): Facture {
        bulletinPai.dateBF = mapToDateTimeBackEnd(formGroup.get('dateBF')?.value);
        bulletinPai.dateReglement = mapToDateTimeBackEnd(formGroup.get('dateReglement')?.value);
        bulletinPai.dateReglement2 = formGroup.get('dateReglement2')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement2')?.value) : null;
        bulletinPai.dateReglement3 = formGroup.get('dateReglement3')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement3')?.value) : null;
        bulletinPai.dateReglement4 = formGroup.get('dateReglement4')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement4')?.value) : null;
        bulletinPai.personnelId = formGroup.get('personnelId')?.value;
        bulletinPai.repertoireId = formGroup.get('repertoireId')?.value;
        bulletinPai.typeReglment = formGroup.get('typeReglment')?.value;
        bulletinPai.typeReglment2 = formGroup.get('typeReglment2')?.value;
        bulletinPai.typeReglment3 = formGroup.get('typeReglment3')?.value;
        bulletinPai.typeReglment4 = formGroup.get('typeReglment4')?.value;
        bulletinPai.mantantBF = formGroup.get('mantantBF')?.value;
        bulletinPai.mntReglement = formGroup.get('mntReglement')?.value;
        bulletinPai.mntReglement2 = formGroup.get('mntReglement2')?.value;
        bulletinPai.mntReglement3 = formGroup.get('mntReglement3')?.value;
        bulletinPai.mntReglement4 = formGroup.get('mntReglement4')?.value;

        return bulletinPai;
    }

    updateQteStock(listDetBulletinPai: DetFacture[], operationType: OperationType) {
        if (listDetBulletinPai && listDetBulletinPai.length > 0) {
            // Filter items that have a stockId
            const itemsToUpdate = listDetBulletinPai.filter((detFacture) => detFacture.stockId);

            // Process each item sequentially with 1 second delay between requests
            from(itemsToUpdate)
                .pipe(
                    concatMap((detFacture: DetFacture, index: number) =>
                        this.stockService.updateQteStock(detFacture.stockId!, detFacture.qteFacturer, operationType).pipe(
                            delay(index === itemsToUpdate.length - 1 ? 0 : 1000) // No delay after the last item
                        )
                    )
                )
                .subscribe({
                    next: () => {},
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    updateStock(detFactureToAdd: DetFacture[], detFactureToModify: DetFacture[], detFactureToDelete: DetFacture[], detFactureChanged: DetFacture[]) {
        if (detFactureToDelete && detFactureToDelete.length > 0) {
            this.updateQteStock(detFactureToDelete, OperationType.DELETE);
        }

        if (detFactureChanged && detFactureChanged.length > 0) {
            this.updateQteStock(detFactureChanged, OperationType.DELETE);
        }

        if (detFactureToModify && detFactureToModify.length > 0) {
            this.updateQteStock(detFactureToModify, OperationType.ADD);
        }

        if (detFactureToAdd && detFactureToAdd.length > 0) {
            this.updateQteStock(detFactureToAdd, OperationType.ADD);
        }
    }

    giveMeMntBlBenefice(bulletinPai: Facture, detFactures: DetFacture[], etablissement: Etablissement) {
        let mntp: number = 0;
        for (let detFacture of detFactures) {
            let charge = (detFacture.stock?.pattc || 0 * (etablissement && etablissement.pourcentageLiv ? etablissement.pourcentageLiv : 0)) / 100;
            mntp += detFacture.montantProduit - detFacture.qteFacturer * (detFacture.stock?.pattc || 0 + charge);
        }
        bulletinPai.mantantBFBenefice = mntp;
    }

    prepareFacture() {
        this.giveMeMntBlBenefice(this.bulletinPai, this.listDetBulletinPai, this.etablissement);
    }

    miseAjour() {
        this.submitted = true;
        let trvErreur: boolean = false;
        if (!trvErreur) {
            this.bulletinPai = this.mapFormGroupToObject(this.formGroup, this.bulletinPai);
            this.prepareFacture();

            let factureRequest: FactureRequest = {
                bulletinPai: this.bulletinPai,
                detFactures: this.listDetBulletinPai
            };

            if (this.bulletinPai.id) {
                this.bulletinPaiService.update(this.bulletinPai.id, factureRequest).subscribe({
                    next: (data: Facture) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.router.navigate(['/bulletinPai']);
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
                factureRequest.bulletinPai.employeOperateurId = BigInt(this.personnelCreationId || 0);
                this.bulletinPaiService.create(factureRequest).subscribe({
                    next: (data: Facture) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.router.navigate(['/bulletinPai']);
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
        }
    }

    fermer() {
        this.router.navigate(['/bulletinPai']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
