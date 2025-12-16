import { DetLivraison } from '@/models/det-livraison';
import { initObjectLivraison, Livraison } from '@/models/livraison';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { LivraisonService } from '@/services/livraison/livraison-service';
import { DetLivraisonService } from '@/services/det-livraison/det-livraison-service';
import { Router } from '@angular/router';
import { OperationType } from '@/shared/enums/operation-type';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { DataService } from '@/shared/services/data-service';
import { initObjectStock, Stock } from '@/models/stock';
import { StockService } from '@/services/stock/stock-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-livraison-view-component',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputNumberModule,
    SelectModule,
    MessageModule
],
  templateUrl: './livraison-view-component.html',
  styleUrl: './livraison-view-component.scss'
})
export class LivraisonViewComponent implements OnInit {
  listLivraison: Livraison[] = [];
  livraison: Livraison = initObjectLivraison();
  listFournisseur: Fournisseur[] = [];
  listPersonnel: Personnel[] = [];
  listStock: Stock[] = [];
  selectedLivraison: Livraison | null = null;
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  mapOfStocks: Map<number, string> = new Map<number, string>();
  mapOfFournisseurs: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  msg = APP_MESSAGES;

  constructor(
      private livraisonService: LivraisonService,
      private detLivraisonService: DetLivraisonService,
      private fournisseurService: FournisseurService,
      private stockService: StockService,
      private dataService: DataService,
      private personnelService: PersonnelService,
      private router: Router,
      private messageService: MessageService,
      private loadingService: LoadingService
  ) {}

    ngOnInit(): void {
      this.search();
      this.getAllFournisseur();
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
      this.listLivraison = [];
        this.loadingService.show();
        //let livraison = initObjectLivraison();
        this.livraisonService.getAll().subscribe({
            next: (livraisons) => {
                this.listLivraison = livraisons;
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

    getAllFournisseur() {
      this.listFournisseur = [];
      let objectSearch: Fournisseur = this.initObjectFournisseurSearch(false, false);

        this.fournisseurService.search(objectSearch).subscribe({
          next: (fournisseurs) => {
              this.listFournisseur = fournisseurs;
              this.mapOfFournisseurs = this.listFournisseur.reduce((map, fournisseur) => map.set(Number(fournisseur.id), fournisseur.designation), new Map<number, string>());
          },
          error: (error) => {
              console.log(error);
          },
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
          },
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
          },
      });
    }

    getDesignationPersonnel(personnelId: number): string {
        return this.mapOfPersonnels.get(personnelId) || '';
    }

    getDesignationStock(stockId: number): string {
        return this.mapOfStocks.get(stockId) || '';
    }

    getDesignationFournisseur(fournisseurId: number): string {
        return this.mapOfFournisseurs.get(fournisseurId) || '';
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    async generateNumLivraison(livraison: Livraison) {
		let changeCodeBL: boolean = true;
		let localDate: Date = null != livraison.dateBl ? livraison.dateBl : new Date();
		let annee: string = localDate.getFullYear().toString().substring(2);
		
		if(livraison.codeBl && livraison.codeBl.length > 0) {
			let anneeAncien: string = livraison.codeBl.substring(0, 2);
			if(annee === anneeAncien) {
				changeCodeBL = false;
			}
		}
		
		if(changeCodeBL) {
			let num: number = 0;
			num = await this.getLastNumLivraison(livraison.dateBl, livraison.id ? Number(livraison.id) : null);

			let codbl: string = num + "";
			let codeBL: string = "";
			if (codbl.length == 1) {
				codeBL = annee + "-000" + num /*"L000" + num*/;
			} else if (codbl.length == 2) {
				codeBL = annee + "-00" + num /*"L00" + num*/;
			}
			if (codbl.length >= 3) {
				codeBL = annee + "-0" + num /*"L0" + num*/;
			}
			
			livraison.numLivraison = num;
			livraison.codeBl = codeBL;
		}
	}

    async viderAjouter() {
        let livraison = initObjectLivraison();
        await this.generateNumLivraison(livraison);
        this.emitToPageUpdate(livraison);
    }

    emitToPageUpdate(selectedLivraison: Livraison) {
        if(selectedLivraison) {
            let listDetail: DetLivraison[] = [];
            
            if(selectedLivraison.id) {
                this.livraisonService.getByIdWithDetLivraison(selectedLivraison.id).subscribe({
                    next: (livraisonRequest) => {
                        selectedLivraison = livraisonRequest.livraison;
                        listDetail = livraisonRequest.detLivraisons;
                    },
                    error: (error) => {
                        console.log(error);
                    },
                    complete: () => {
                        this.dataService.setLivraisonData({
                            livraison: selectedLivraison, 
                            detLivraisons: listDetail, 
                            listFournisseur: this.listFournisseur,
                            listStock: this.listStock,
                            listPersonnel: this.listPersonnel 
                        });
                        this.router.navigate(['/livraison-update']);
                    }
                });
            } else {
                this.dataService.setLivraisonData({
                    livraison: selectedLivraison,
                    detLivraisons: [], 
                    listFournisseur: this.listFournisseur,
                    listStock: this.listStock,
                    listPersonnel: this.listPersonnel 
                });
                this.router.navigate(['/livraison-update']);
            }
        }
    }

    recupperer(operation: number, livraisonEdit: Livraison) {
        if (livraisonEdit && livraisonEdit.id) {
            this.livraison = livraisonEdit;
            if (operation === 1) {
                this.emitToPageUpdate(this.livraison);
            } else {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(livraison: Livraison, list: Livraison[], operationType: OperationType, id?: bigint): Livraison[] {
        if (operationType === OperationType.ADD) {
            list = [...list, livraison];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex(x => x.id === livraison.id);
            if (index > -1) {
                list[index] = livraison;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter(x => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listFournisseur) {
            this.listFournisseur = [];
        }
    }

    supprimer(): void {
        if (this.livraison && this.livraison.id) {
            this.loadingService.show();
            let id = this.livraison.id;
            this.livraisonService.delete(this.livraison.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });
                    this.checkIfListIsNull();
                    this.listLivraison = this.updateList(initObjectLivraison(), this.listLivraison, OperationType.DELETE, id);
                    this.livraison = initObjectLivraison();
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

    async getLastNumLivraison(date: Date, id: number | null): Promise<number> {
        try {
            let dateBl = mapToDateTimeBackEnd(date);
            let body = { dateBl: dateBl.toISOString(), id: id };
            const existsObservable = this.livraisonService.getLastNumLivraison(body).pipe(
                catchError(error => {
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
