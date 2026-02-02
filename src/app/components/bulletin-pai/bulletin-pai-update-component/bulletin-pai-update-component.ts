import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@/shared/services/data-service';
import { Router } from '@angular/router';
import { Subscription, catchError, firstValueFrom, of } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initObjectStock, Stock } from '@/models/stock';
import { StockService } from '@/services/stock/stock-service';
import { compareYearAndMonth, getLastDayOfMonth, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
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
import { DetBulletinLivraison, initObjectDetBulletinLivraison } from '@/models/det-bulletin-livraison';
import { StateService } from '@/state/state-service';
import { BulletinPaiResponse } from '@/shared/classes/responses/bulletin-pai-response';
import { PrimeService } from '@/services/prime/prime-service';
import { initObjectPrime, Prime } from '@/models/prime';
import { BulletinPaiValidator } from '@/validators/bulletin-pai-validator';
import { BulletinPaiRequest, initBulletinPaiRequest } from '@/shared/searchModels/bulletin-pai-request';

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
    listDetBulletinPaiSansMontant: DetBulletinPai[] = [];
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
    detBulletinLivraisonSelected: DetBulletinLivraison = initObjectDetBulletinLivraison();
    stockSelected: Stock = initObjectStock();
    msg = APP_MESSAGES;
    formGroup!: FormGroup;
    formGroupStock!: FormGroup;
    typeReglements: { label: string; value: number }[] = filteredTypeReglement;

    constructor(
        private bulletinPaiService: BulletinPaiService,
        private primeService: PrimeService,
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
        this.initFormGroup();

        this.subscription = this.dataService.currentBulletinPai$.subscribe((data) => {
            if (!data) {
                this.router.navigate(['/bulletin-pai']);
                return;
            }
            this.getEtablissement();
            this.bulletinPai = this.adjustBulletinPai(data.bulletinPai);
            this.listDetBulletinPai = data.detBulletinPais;
            this.listDetBulletinPaiSansMontant = data.detBulletinPaisSansMontant;
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
            dateDebut: bulletinPai.dateDebut,
            dateFin: bulletinPai.dateFin,
            personnelId: bulletinPai.commercialId,
            totalMntVendue: bulletinPai.totalMntVendue,
            totalMntVenduePrixCommercial: bulletinPai.totalMntVenduePrixCommercial,
            totalMntVendueSansPrixCommercial: bulletinPai.totalMntVendueSansPrixCommercial,
            frais: bulletinPai.frais,
            salairefx: bulletinPai.salairefx,
            primeSpecial: bulletinPai.primeSpecial,
            primeProduit: bulletinPai.primeProduit,
            primeCommercial: bulletinPai.primeCommercial,
            mntCNSS: bulletinPai.mntCNSS,
            total: bulletinPai.total,
            fraisSupp: bulletinPai.fraisSupp
        });
        this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetBulletinPai is set
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                dateDebut: [new Date(), [Validators.required]],
                dateFin: [new Date(), [Validators.required]],
                personnelId: [0, [Validators.required, Validators.min(1)]],
                totalMntVendue: [0],
                totalMntVenduePrixCommercial: [0],
                totalMntVendueSansPrixCommercial: [0],
                frais: [0],
                salairefx: [0],
                primeSpecial: [0],
                primeProduit: [0],
                primeCommercial: [0],
                mntCNSS: [0],
                total: [0],
                fraisSupp: [0]
            },
            { validators: BulletinPaiValidator({ getListDetBulletinPai: () => this.listDetBulletinPai, getListDetBulletinLivraison: () => this.listDetBulletinLivraison }) }
        );

        this.formGroup.get('totalMntVendue')?.disable();
        this.formGroup.get('totalMntVenduePrixCommercial')?.disable();
        this.formGroup.get('totalMntVendueSansPrixCommercial')?.disable();
    }

    onChangeIdCommercial() {
        let salaire: number = 0;

        if (this.formGroup.get('personnelId')?.value > 0) {
            let personnel = this.listPersonnel.find((personnel) => personnel.id === this.formGroup.get('personnelId')?.value);
            if (personnel && personnel.id) {
                salaire = personnel.salaire;
                this.rechercheLivraison();
            }
        }

        this.formGroup.patchValue({
            frais: salaire
        });
    }

    calculTotal() {
        let slFx = 0.0;
        let fris = 0.0;
        let mntCnss = 0.0;
        let mntPenalite = 0.0;
        let tot = 0.0;
        let primeSpeciale = 0.0;
        let mntPrimeCommercial = 0.0;
        let primeProduit = 0;

        if (this.bulletinPai.salairefx != 0.0) {
            slFx = this.bulletinPai.salairefx;
        }
        if (this.bulletinPai.mntPenalite != 0.0) {
            mntPenalite = this.bulletinPai.mntPenalite;
        }
        if (this.bulletinPai.frais != 0.0) {
            fris = this.bulletinPai.frais;
        }
        if (this.bulletinPai.primeSpecial != 0.0) {
            primeSpeciale = this.bulletinPai.primeSpecial;
        }
        if (this.bulletinPai.mntCNSS != 0.0) {
            mntCnss = this.bulletinPai.mntCNSS;
        } else {
            this.bulletinPai.mntCNSS = mntCnss;
        }
        if (this.bulletinPai.primeProduit != 0.0) {
            primeProduit = this.bulletinPai.primeProduit;
        }
        if (this.bulletinPai.primeCommercial != 0.0) {
            mntPrimeCommercial = this.bulletinPai.primeCommercial;
        }

        tot = primeSpeciale + fris + slFx + primeProduit + mntPrimeCommercial - mntCnss - mntPenalite;
        this.bulletinPai.total = tot;
    }

    async getPrimes(montant: number): Promise<Prime[]> {
        try {
            let prime: Prime = initObjectPrime();
            prime.montant = montant;
            const existsObservable = this.primeService.searchMontant(prime).pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of([]); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return [];
        }
    }

    async getDetails(bulletinPaiRequest: BulletinPaiRequest): Promise<BulletinPaiResponse | null> {
        try {
            if (bulletinPaiRequest.livraisonId == null) {
                const existsObservable = this.bulletinPaiService.getDetails(bulletinPaiRequest).pipe(
                    catchError((error) => {
                        console.error('Error in absence existence observable:', error);
                        return of(null); // Gracefully handle observable errors by returning false
                    })
                );
                return await firstValueFrom(existsObservable);
            } else {
                const existsObservable = this.bulletinPaiService.getDetailsOfLivraison(bulletinPaiRequest).pipe(
                    catchError((error) => {
                        console.error('Error in absence existence observable:', error);
                        return of(null); // Gracefully handle observable errors by returning false
                    })
                );
                return await firstValueFrom(existsObservable);
            }
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return null;
        }
    }

    async calculerPrime() {
        this.bulletinPai.primeSpecial = 0;

        if (this.bulletinPai.totalMntVendueSansPrixCommercial > 0) {
            let primes: Prime[] = await this.getPrimes(this.bulletinPai.totalMntVendueSansPrixCommercial);

            if (primes.length > 0) {
                this.bulletinPai.primeSpecial = primes[0].prime;
            }
        }
    }

    calculerSalaireFix() {
        this.bulletinPai.salairefx = this.bulletinPai.commissionParProduit;
    }

    calculComm() {
        let comSum = 0.0;
        let totalMntVendue = 0.0;
        let mntNega = 0.0;

        for (let detbultinlivraisonss of this.listDetBulletinLivraison) {
            let comm = detbultinlivraisonss.commission;
            detbultinlivraisonss.rougenormal = true;
            if (comm <= 0) {
                detbultinlivraisonss.rougenormal = false;
            }

            totalMntVendue += detbultinlivraisonss.livraisonMantantBL;
            let clcComm = 0;

            if (detbultinlivraisonss.livraisonMantantBL == 0.0) {
                clcComm = ((comm * detbultinlivraisonss.livraisonMantantBLReel) / 100) * -1;
                clcComm -= detbultinlivraisonss.livraisonMantantBLReel;
                detbultinlivraisonss.commsiondh = clcComm;
            } else {
                clcComm = (comm * detbultinlivraisonss.livraisonMantantBLReel) / 100;
                detbultinlivraisonss.commsiondh = clcComm;
            }

            if (comm < 0) {
                mntNega += detbultinlivraisonss.commsiondh;
            }

            detbultinlivraisonss.commissionFixe = detbultinlivraisonss.commission;
            comSum += clcComm;
        }

        let mnttotalMntVenduePrixCommercial = this.getTotalMntVenduProduit(this.listDetBulletinPai, true);
        let mnttotalMntVendueSansPrixCommercial = this.getTotalMntVenduProduit(this.listDetBulletinPai, false);

        this.bulletinPai.commission = comSum;
        this.bulletinPai.mntNegativeLivraison = mntNega;
        this.bulletinPai.totalMntVendueLivraison = totalMntVendue;
        this.bulletinPai.totalMntVendue = this.bulletinPai.totalMntVendueLivraison;
        this.bulletinPai.totalMntVenduePrixCommercial = mnttotalMntVenduePrixCommercial;
        this.bulletinPai.totalMntVendueSansPrixCommercial = mnttotalMntVendueSansPrixCommercial;

        this.calculTotal();
    }

    calculerCommission() {
        let comSum: number = 0;

        let totalMntVendue: number = 0;
        let primeProduit: number = 0;
        let mntNega: number = 0;

        for (let detbultinpaiAdd of this.listDetBulletinPai) {
            totalMntVendue += detbultinpaiAdd.mantantvendu;
            let comm = detbultinpaiAdd.commission;

            let clcComm = (detbultinpaiAdd.mantantvendu * comm) / 100;
            if (detbultinpaiAdd.mantantvendu == 0) {
                clcComm = ((comm * detbultinpaiAdd.qtevendu * detbultinpaiAdd.produitPvttc) / 100) * -1;
                clcComm -= detbultinpaiAdd.qtevendu * detbultinpaiAdd.produitPvttc;
            }

            detbultinpaiAdd.commsiondh = clcComm;
            detbultinpaiAdd.commissionFixe = detbultinpaiAdd.commission;
            comSum += clcComm;

            if (comm < 0) {
                mntNega += detbultinpaiAdd.commsiondh;
            }
        }

        let mntPrimeCommercial = 0;
        let mnttotalMntVenduePrixCommercial = this.getTotalMntVenduProduit(this.listDetBulletinPai, true);
        let mnttotalMntVendueSansPrixCommercial = this.getTotalMntVenduProduit(this.listDetBulletinPai, false);

        if (this.listDetBulletinPai.length > 0) {
            mntPrimeCommercial = this.listDetBulletinPai.reduce((sum, detbultinpai) => sum + detbultinpai.primeCommercial, 0);
            primeProduit = this.listDetBulletinPai.reduce((sum, detbultinpai) => sum + detbultinpai.primeProduit, 0);
        }

        this.bulletinPai.commissionParProduit = comSum;
        this.bulletinPai.mntNegativeProduit = mntNega;
        this.bulletinPai.totalMntVendueProduit = totalMntVendue;
        this.bulletinPai.totalMntVendue = this.bulletinPai.totalMntVendueLivraison;
        this.bulletinPai.totalMntVenduePrixCommercial = mnttotalMntVenduePrixCommercial;
        this.bulletinPai.totalMntVendueSansPrixCommercial = mnttotalMntVendueSansPrixCommercial;
        this.bulletinPai.primeCommercial = mntPrimeCommercial;
        this.bulletinPai.primeProduit = primeProduit;

        this.calculerPrime();
        this.calculTotal();
    }

    getTotalMntVenduProduit(listDetbultinpai: DetBulletinPai[], avecPrixCommercial: boolean): number {
        let mnt = 0;
        if (listDetbultinpai.length > 0) {
            mnt = avecPrixCommercial
                ? listDetbultinpai.filter((x) => x.prixCommercial > 0).reduce((sum, detbultinpai) => sum + detbultinpai.mantantvendu, 0)
                : listDetbultinpai.filter((x) => x.prixCommercial == 0).reduce((sum, detbultinpai) => sum + detbultinpai.mantantvendu, 0);
        }

        return mnt;
    }

    mapToBulletinPaiRequest(bulletinPai: BulletinPai, livraisonId: bigint | null): BulletinPaiRequest {
        let bulletinPaiRequest: BulletinPaiRequest = initBulletinPaiRequest();

        bulletinPaiRequest.dateDebut = bulletinPai.dateDebut;
        bulletinPaiRequest.dateFin = bulletinPai.dateFin;
        bulletinPaiRequest.commercialId = bulletinPai.commercialId;
        bulletinPaiRequest.livraisonId = livraisonId;

        return bulletinPaiRequest;
    }

    async rechercheLivraison() {
        if (this.formGroup.get('dateDebut')?.value && this.formGroup.get('dateFin')?.value && this.formGroup.get('personnelId')?.value > 0) {
            this.bulletinPai.dateDebut = mapToDateTimeBackEnd(this.formGroup.get('dateDebut')?.value);
            this.bulletinPai.dateFin = mapToDateTimeBackEnd(this.formGroup.get('dateFin')?.value);
            this.bulletinPai.commercialId = this.formGroup.get('personnelId')?.value;
            let bulletinPaiRequest: BulletinPaiRequest = this.mapToBulletinPaiRequest(this.bulletinPai, null);

            let bulletinPaiResponse: BulletinPaiResponse | null = await this.getDetails(bulletinPaiRequest);

            if (bulletinPaiResponse != null) {
                this.listDetBulletinPai = bulletinPaiResponse.detBulletinPais;
                this.listDetBulletinLivraison = bulletinPaiResponse.detBulletinLivraisons;
            }
        } else {
            this.listDetBulletinPai = [];
            this.listDetBulletinLivraison = [];
        }
    }

    removeDetBulletinPai(listDetBulletinPaiLivraisonId: DetBulletinPai[], avecZero: boolean) {
        if (avecZero) {
            for (let index = 0; index < listDetBulletinPaiLivraisonId.length; index++) {
                const detBulletinPaiLivraisonId = listDetBulletinPaiLivraisonId[index];

                for (let indexDet = 0; indexDet < this.listDetBulletinPai.length; indexDet++) {
                    const detBulletinPai = this.listDetBulletinPai[indexDet];
                    if (detBulletinPai.produitId == detBulletinPaiLivraisonId.produitId && detBulletinPai.avecZero) {
                        if (detBulletinPai.qtevendu === detBulletinPaiLivraisonId.qtevendu) {
                            this.listDetBulletinPai.splice(indexDet, 1);
                        } else {
                            detBulletinPai.qtevendu -= detBulletinPaiLivraisonId.qtevendu;
                            detBulletinPai.prixlivraison -= detBulletinPaiLivraisonId.prixlivraison;
                            detBulletinPai.remise -= detBulletinPaiLivraisonId.remise;
                            detBulletinPai.mantantvendu -= detBulletinPaiLivraisonId.mantantvendu;
                            detBulletinPai.benDH -= detBulletinPaiLivraisonId.benDH;
                        }
                    }
                }
            }
        } else {
            for (let index = 0; index < listDetBulletinPaiLivraisonId.length; index++) {
                const detBulletinPaiLivraisonId = listDetBulletinPaiLivraisonId[index];

                for (let indexDet = 0; indexDet < this.listDetBulletinPaiSansMontant.length; indexDet++) {
                    const detBulletinPai = this.listDetBulletinPaiSansMontant[indexDet];
                    if (detBulletinPai.produitId == detBulletinPaiLivraisonId.produitId && !detBulletinPai.avecZero) {
                        if (detBulletinPai.qtevendu === detBulletinPaiLivraisonId.qtevendu) {
                            this.listDetBulletinPaiSansMontant.splice(indexDet, 1);
                        } else {
                            detBulletinPai.qtevendu -= detBulletinPaiLivraisonId.qtevendu;
                        }
                    }
                }
            }
        }
    }

    async supprimerDetailBulletinLivraison(livraisonId: bigint) {
        let bulletinPaiRequest: BulletinPaiRequest = this.mapToBulletinPaiRequest(this.bulletinPai, livraisonId);
        let bulletinPaiResponse: BulletinPaiResponse | null = await this.getDetails(bulletinPaiRequest);

        if (bulletinPaiResponse != null) {
            let listDetBulletinPaiLivraisonId: DetBulletinPai[] = bulletinPaiResponse.detBulletinPais;
            let listDetBulletinPaiSansMontant: DetBulletinPai[] = bulletinPaiResponse.detBulletinPaisSansMontant;

            this.removeDetBulletinPai(listDetBulletinPaiLivraisonId, true);
            this.removeDetBulletinPai(listDetBulletinPaiSansMontant, false);

            this.calculComm();
            this.calculerCommission();
        }
    }

    calculerTotalMntVendueProduit() {
        let totalMntVendueProduit: number = 0;
        this.listDetBulletinPai.forEach((detBulletinPai: DetBulletinPai) => {
            totalMntVendueProduit += detBulletinPai.mantantvendu;
        });

        this.formGroup.patchValue({
            totalMntVendueProduit: totalMntVendueProduit
        });
    }

    calculerTotalMntVendueLivraison() {
        let totalMntVendueLivraison: number = 0;
        this.listDetBulletinLivraison.forEach((detBulletinLivraison: DetBulletinLivraison) => {
            totalMntVendueLivraison += detBulletinLivraison.livraisonMantantBL;
        });

        this.formGroup.patchValue({
            totalMntVendueLivraison: totalMntVendueLivraison
        });
    }

    onChangeDates() {
        this.ajusterDates();
        this.rechercheLivraison();
    }

    ajusterDates() {
        if (this.formGroup.get('dateDebut')?.value) {
            let dateDebut = this.formGroup.get('dateDebut')?.value;
            let changed: boolean = compareYearAndMonth(dateDebut, this.bulletinPai.dateDebut);

            if (dateDebut.getDate() > 1) {
                dateDebut.setDate(1);
            }

            if (!this.formGroup.get('dateFin')?.value || changed) {
                let dateFin = getLastDayOfMonth(dateDebut);

                this.formGroup.patchValue({
                    dateDebut: dateDebut,
                    dateFin: dateFin
                });

                this.bulletinPai.dateDebut = mapToDateTimeBackEnd(dateDebut);
                this.bulletinPai.dateFin = mapToDateTimeBackEnd(dateFin);
            }
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, bulletinPai: BulletinPai): BulletinPai {
        bulletinPai.dateDebut = mapToDateTimeBackEnd(formGroup.get('dateDebut')?.value);
        bulletinPai.dateFin = mapToDateTimeBackEnd(formGroup.get('dateFin')?.value);
        bulletinPai.commercialId = formGroup.get('personnelId')?.value;
        bulletinPai.totalMntVendue = formGroup.get('totalMntVendue')?.value;
        bulletinPai.totalMntVenduePrixCommercial = formGroup.get('totalMntVenduePrixCommercial')?.value;
        bulletinPai.totalMntVendueSansPrixCommercial = formGroup.get('totalMntVendueSansPrixCommercial')?.value;
        bulletinPai.frais = formGroup.get('frais')?.value;
        bulletinPai.salairefx = formGroup.get('salairefx')?.value;
        bulletinPai.primeSpecial = formGroup.get('primeSpecial')?.value;
        bulletinPai.primeProduit = formGroup.get('primeProduit')?.value;
        bulletinPai.primeCommercial = formGroup.get('primeCommercial')?.value;
        bulletinPai.mntCNSS = formGroup.get('mntCNSS')?.value;
        bulletinPai.total = formGroup.get('total')?.value;
        bulletinPai.fraisSupp = formGroup.get('fraisSupp')?.value;

        return bulletinPai;
    }

    openCloseDialogStock(openClose: boolean): void {
        this.dialogStock = openClose;
    }

    openCloseDialogDeleteStock(openClose: boolean): void {
        this.dialogDeleteStock = openClose;
    }

    updateList(detailFacture: DetBulletinLivraison, list: DetBulletinLivraison[], operationType: OperationType, livraisonId?: bigint): DetBulletinLivraison[] {
        if (operationType === OperationType.ADD) {
            list = [...list, detailFacture];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.livraisonId === detailFacture.livraisonId);
            if (index > -1) {
                list[index] = structuredClone(detailFacture);
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.livraisonId !== livraisonId);
        }
        return list;
    }

    recuppererDetBulletinLivraison(operation: number, detBulletinLivraisonEdit: DetBulletinLivraison) {
        if (detBulletinLivraisonEdit && detBulletinLivraisonEdit.livraisonId) {
            this.detBulletinLivraisonSelected = structuredClone(detBulletinLivraisonEdit);
            if (operation === 1) {
                this.openCloseDialogStock(true);
            } else {
                this.openCloseDialogDeleteStock(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    deleteDetBulletinLivraison() {
        let livraisonId: bigint = this.detBulletinLivraisonSelected?.livraisonId || 0n;
        this.listDetBulletinLivraison = this.updateList(this.detBulletinLivraisonSelected, this.listDetBulletinLivraison, OperationType.DELETE, livraisonId);
        this.formGroup.updateValueAndValidity();
        this.openCloseDialogDeleteStock(false);
    }

    miseAjour() {
        this.submitted = true;
        let trvErreur: boolean = false;
        if (!trvErreur) {
            this.bulletinPai = this.mapFormGroupToObject(this.formGroup, this.bulletinPai);

            let bulletinPaiRequest: BulletinPaiResponse = {
                bulletinPai: this.bulletinPai,
                detBulletinPais: this.listDetBulletinPai,
                detBulletinPaisSansMontant: [],
                detBulletinLivraisons: this.listDetBulletinLivraison
            };

            if (this.bulletinPai.id) {
                this.bulletinPaiService.update(this.bulletinPai.id, bulletinPaiRequest).subscribe({
                    next: (data: BulletinPai) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.router.navigate(['/bulletin-pai']);
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
                bulletinPaiRequest.bulletinPai.operateurId = BigInt(this.personnelCreationId || 0);
                this.bulletinPaiService.create(bulletinPaiRequest).subscribe({
                    next: (data: BulletinPai) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.router.navigate(['/bulletin-pai']);
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
        this.router.navigate(['/bulletin-pai']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
