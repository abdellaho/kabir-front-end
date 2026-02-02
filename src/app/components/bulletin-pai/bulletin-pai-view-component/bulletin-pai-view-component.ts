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
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { initObjectStock, Stock } from '@/models/stock';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { StockService } from '@/services/stock/stock-service';
import { DataService } from '@/shared/services/data-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { OperationType } from '@/shared/enums/operation-type';
import { BulletinPai, initObjectBulletinPai } from '@/models/bulletin-pai';
import { BulletinPaiService } from '@/services/bulletin-pai/bulletin-pai-service';
import { DetBulletinPai } from '@/models/det-bulletin-pai';
import { DetBulletinLivraison } from '@/models/det-bulletin-livraison';

@Component({
    selector: 'app-bulletin-pai-view-component',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, ToolbarModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule, DialogModule, FloatLabelModule, InputNumberModule, SelectModule, MessageModule],
    templateUrl: './bulletin-pai-view-component.html',
    styleUrl: './bulletin-pai-view-component.scss'
})
export class BulletinPaiViewComponent implements OnInit {
    //Tableau --> Client + ICE + Date + Num bulletinPai + date paiements + Paiement + cheque num + remise num + montant payé + total payé + action

    listBulletinPai: BulletinPai[] = [];
    bulletinPai: BulletinPai = initObjectBulletinPai();
    listPersonnel: Personnel[] = [];
    listStock: Stock[] = [];
    selectedBulletinPai: BulletinPai | null = null;
    mapOfPersonnels: Map<number, string> = new Map<number, string>();
    mapOfStocks: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    msg = APP_MESSAGES;

    constructor(
        private bulletinPaiService: BulletinPaiService,
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
        this.listBulletinPai = [];
        this.loadingService.show();
        //let bulletinPai = initObjectFacture();
        this.bulletinPaiService.getAll().subscribe({
            next: (bulletinPais) => {
                this.listBulletinPai = bulletinPais;
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

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    async generateNum(bulletinPai: BulletinPai) {
        let num: number = 0;
        num = await this.getLastNum();

        let codbl = num + '';
        let codeBLe = '';
        if (codbl.length == 1) {
            codeBLe = 'P000' + num;
        } else if (codbl.length == 2) {
            codeBLe = 'P00' + num;
        }
        if (codbl.length >= 3) {
            codeBLe = 'P0' + num;
        }

        bulletinPai.numBulletin = num;
        bulletinPai.codeBulletin = codeBLe;
    }

    async viderAjouter() {
        let bulletinPai = initObjectBulletinPai();
        await this.generateNum(bulletinPai);
        this.emitToPageUpdate(bulletinPai);
    }

    emitToPageUpdate(selectedBulletinPai: BulletinPai) {
        if (selectedBulletinPai) {
            let listDetail: DetBulletinPai[] = [];
            let listDetBulletinPaiSansMontant: DetBulletinPai[] = [];
            let listDetBulletinLivraison: DetBulletinLivraison[] = [];

            if (selectedBulletinPai.id) {
                this.bulletinPaiService.getByIdResponse(selectedBulletinPai.id).subscribe({
                    next: (bulletinPaiResponse) => {
                        selectedBulletinPai = bulletinPaiResponse.bulletinPai;
                        listDetail = bulletinPaiResponse.detBulletinPais;
                        listDetBulletinPaiSansMontant = bulletinPaiResponse.detBulletinPaisSansMontant;
                        listDetBulletinLivraison = bulletinPaiResponse.detBulletinLivraisons;
                    },
                    error: (error) => {
                        console.log(error);
                    },
                    complete: () => {
                        this.dataService.setBulletinPaiData({
                            bulletinPai: selectedBulletinPai,
                            detBulletinPais: listDetail,
                            detBulletinPaisSansMontant: listDetBulletinPaiSansMontant,
                            detBulletinLivraisons: listDetBulletinLivraison,
                            listPersonnel: this.listPersonnel,
                            listStock: this.listStock
                        });
                        this.router.navigate(['/bulletinPai-update']);
                    }
                });
            } else {
                this.dataService.setBulletinPaiData({
                    bulletinPai: selectedBulletinPai,
                    detBulletinPais: [],
                    detBulletinPaisSansMontant: [],
                    detBulletinLivraisons: [],
                    listPersonnel: this.listPersonnel,
                    listStock: this.listStock
                });
                this.router.navigate(['/bulletinPai-update']);
            }
        }
    }

    recupperer(operation: number, bulletinPaiEdit: BulletinPai) {
        if (bulletinPaiEdit && bulletinPaiEdit.id) {
            this.bulletinPai = bulletinPaiEdit;
            if (operation === 1) {
                this.emitToPageUpdate(this.bulletinPai);
            } else {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(bulletinPai: BulletinPai, list: BulletinPai[], operationType: OperationType, id?: bigint): BulletinPai[] {
        if (operationType === OperationType.ADD) {
            list = [...list, bulletinPai];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === bulletinPai.id);
            if (index > -1) {
                list[index] = bulletinPai;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listBulletinPai) {
            this.listBulletinPai = [];
        }
        if (null == this.listStock) {
            this.listStock = [];
        }
        if (null == this.listPersonnel) {
            this.listPersonnel = [];
        }
    }

    supprimer(): void {
        if (this.bulletinPai && this.bulletinPai.id) {
            this.loadingService.show();
            let id = this.bulletinPai.id;
            this.bulletinPaiService.delete(this.bulletinPai.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listBulletinPai = this.updateList(initObjectBulletinPai(), this.listBulletinPai, OperationType.DELETE, id);
                    this.bulletinPai = initObjectBulletinPai();
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

    async getLastNum(): Promise<number> {
        try {
            const existsObservable = this.bulletinPaiService.getLastNum().pipe(
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
