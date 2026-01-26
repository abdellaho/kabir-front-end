import { arrayToMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { Component, OnInit } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { Facture, initObjectFacture } from '@/models/facture';
import { Repertoire } from '@/models/repertoire';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { initObjectStock, Stock } from '@/models/stock';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { FactureService } from '@/services/facture/facture-service';
import { RepertoireService } from '@/services/repertoire/repertoire-service';
import { StockService } from '@/services/stock/stock-service';
import { DataService } from '@/shared/services/data-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { TypeSearch } from '@/shared/enums/type-search';
import { OperationType } from '@/shared/enums/operation-type';
import { DetFacture } from '@/models/det-facture';
import { filteredTypeReglement } from '@/shared/enums/type-reglement';

@Component({
    selector: 'app-facture-view-component',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, ToolbarModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule, DialogModule, FloatLabelModule, InputNumberModule, SelectModule, MessageModule],
    templateUrl: './facture-view-component.html',
    styleUrl: './facture-view-component.scss'
})
export class FactureViewComponent implements OnInit {
    //Tableau --> Client + ICE + Date + Num facture + date paiements + Paiement + cheque num + remise num + montant payé + total payé + action

    listFacture: Facture[] = [];
    facture: Facture = initObjectFacture();
    listRepertoire: Repertoire[] = [];
    listPersonnel: Personnel[] = [];
    listStock: Stock[] = [];
    selectedFacture: Facture | null = null;
    mapOfPersonnels: Map<number, string> = new Map<number, string>();
    mapOfStocks: Map<number, string> = new Map<number, string>();
    mapOfRepertoire: Map<number, string> = new Map<number, string>();
    mapOfRepertoireICE: Map<number, string> = new Map<number, string>();
    typeReglements: { label: string; value: number }[] = filteredTypeReglement;
    dialogSupprimer: boolean = false;
    msg = APP_MESSAGES;

    constructor(
        private factureService: FactureService,
        private repertoireService: RepertoireService,
        private stockService: StockService,
        private dataService: DataService,
        private personnelService: PersonnelService,
        private router: Router,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.search();
        this.getAllStock();
        this.getAllPersonnel();
        this.getAllRepertoire();
    }

    initObjectFournisseurSearch(archiver: boolean, supprimer: boolean): Fournisseur {
        let objectSearch: Fournisseur = initObjectFournisseur();

        objectSearch.archiver = archiver;
        objectSearch.supprimer = supprimer;

        return objectSearch;
    }

    initObjectStockSearch(archiver: boolean, supprimer: boolean): Stock {
        let stockSearch: Stock = initObjectStock();

        stockSearch.archiver = archiver;
        stockSearch.supprimer = supprimer;

        return stockSearch;
    }

    initObjectPersonnelSearch(archiver: boolean, supprimer: boolean): Personnel {
        let personnelSearch: Personnel = initObjectPersonnel();

        personnelSearch.archiver = archiver;
        personnelSearch.supprimer = supprimer;

        return personnelSearch;
    }

    search() {
        this.listFacture = [];
        this.loadingService.show();
        //let facture = initObjectFacture();
        this.factureService.getAll().subscribe({
            next: (livraisons) => {
                this.listFacture = livraisons;
            },
            error: (error) => {
                console.log(error);
                this.loadingService.hide();
            },
            complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllRepertoire(): void {
        let objectSearch: Repertoire = initObjectSearch(false, false, TypeSearch.Repertoire);
        this.repertoireService.search(objectSearch).subscribe({
            next: (data: Repertoire[]) => {
                this.listRepertoire = data;
                this.mapOfRepertoire = arrayToMap(this.listRepertoire, 'id', ['designation'], ['']);
                this.mapOfRepertoireICE = arrayToMap(this.listRepertoire, 'id', ['ice'], ['']);
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getAllStock() {
        this.listStock = [];
        let objectSearch: Stock = this.initObjectStockSearch(false, false);

        this.stockService.search(objectSearch).subscribe({
            next: (stocks) => {
                this.listStock = stocks;
                this.mapOfStocks = this.listStock.reduce((map, stock) => map.set(Number(stock.id), stock.designation), new Map<number, string>());
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    getAllPersonnel() {
        this.listPersonnel = [];
        let objectSearch: Personnel = this.initObjectPersonnelSearch(false, false);

        this.personnelService.search(objectSearch).subscribe({
            next: (personnels) => {
                this.listPersonnel = personnels;
                this.mapOfPersonnels = this.listPersonnel.reduce((map, personnel) => map.set(Number(personnel.id), personnel.designation), new Map<number, string>());
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    getDesignationPersonnel(personnelId: number): string {
        return this.mapOfPersonnels.get(personnelId) || '';
    }

    getDesignationStock(stockId: number): string {
        return this.mapOfStocks.get(stockId) || '';
    }

    getDesignationRepertoire(repertoireId: number): string {
        return this.mapOfRepertoire.get(repertoireId) || '';
    }

    getRepertoireICE(repertoireId: number): string {
        return this.mapOfRepertoireICE.get(repertoireId) || '';
    }

    getTypeReglement(typeReglement: number): string {
        let filteredTypeReglement = this.typeReglements.filter((type) => type.value === typeReglement);
        return filteredTypeReglement.length > 0 ? filteredTypeReglement[0].label : '';
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    async generateNumLivraison(facture: Facture) {
        let changeCodeBL: boolean = true;
        let localDate: Date = null != facture.dateBF ? facture.dateBF : new Date();
        let annee: string = localDate.getFullYear().toString().substring(2);

        if (facture.codeBF && facture.codeBF.length > 0) {
            let anneeAncien: string = facture.codeBF.substring(0, 2);
            if (annee === anneeAncien) {
                changeCodeBL = false;
            }
        }

        if (changeCodeBL) {
            let num: number = 0;
            num = await this.getLastNumFacture(facture);

            let codbl: string = num + '';
            let codeBF: string = '';
            if (codbl.length == 1) {
                codeBF = annee + '-000' + num /*"L000" + num*/;
            } else if (codbl.length == 2) {
                codeBF = annee + '-00' + num /*"L00" + num*/;
            }
            if (codbl.length >= 3) {
                codeBF = annee + '-0' + num /*"L0" + num*/;
            }

            facture.numFacture = num;
            facture.codeBF = codeBF;
        }
    }

    async viderAjouter() {
        let facture = initObjectFacture();
        await this.generateNumLivraison(facture);
        this.emitToPageUpdate(facture);
    }

    emitToPageUpdate(selectedFacture: Facture) {
        if (selectedFacture) {
            let listDetail: DetFacture[] = [];

            if (selectedFacture.id) {
                this.factureService.getByIdRequest(selectedFacture.id).subscribe({
                    next: (livraisonRequest) => {
                        selectedFacture = livraisonRequest.facture;
                        listDetail = livraisonRequest.detFactures;
                    },
                    error: (error) => {
                        console.log(error);
                    },
                    complete: () => {
                        this.dataService.setFactureData({
                            facture: selectedFacture,
                            detFactures: listDetail,
                            listRepertoire: this.listRepertoire,
                            listStock: this.listStock,
                            listPersonnel: this.listPersonnel
                        });
                        this.router.navigate(['/facture-update']);
                    }
                });
            } else {
                this.dataService.setFactureData({
                    facture: selectedFacture,
                    detFactures: [],
                    listRepertoire: this.listRepertoire,
                    listStock: this.listStock,
                    listPersonnel: this.listPersonnel
                });
                this.router.navigate(['/facture-update']);
            }
        }
    }

    recupperer(operation: number, livraisonEdit: Facture) {
        if (livraisonEdit && livraisonEdit.id) {
            this.facture = livraisonEdit;
            if (operation === 1) {
                this.emitToPageUpdate(this.facture);
            } else {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(facture: Facture, list: Facture[], operationType: OperationType, id?: bigint): Facture[] {
        if (operationType === OperationType.ADD) {
            list = [...list, facture];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === facture.id);
            if (index > -1) {
                list[index] = facture;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listRepertoire) {
            this.listRepertoire = [];
        }
        if (null == this.listStock) {
            this.listStock = [];
        }
        if (null == this.listPersonnel) {
            this.listPersonnel = [];
        }
    }

    supprimer(): void {
        if (this.facture && this.facture.id) {
            this.loadingService.show();
            let id = this.facture.id;
            this.factureService.delete(this.facture.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listFacture = this.updateList(initObjectFacture(), this.listFacture, OperationType.DELETE, id);
                    this.facture = initObjectFacture();
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

    async getLastNumFacture(facture: Facture): Promise<number> {
        try {
            facture.dateBF = mapToDateTimeBackEnd(facture.dateBF);
            const existsObservable = this.factureService.getLastNumFacture(facture).pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of(1); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return 1;
        }
    }
}
