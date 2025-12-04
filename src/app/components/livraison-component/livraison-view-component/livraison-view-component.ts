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
  dialogSupprimer: boolean = false;
  msg = APP_MESSAGES;

  constructor(
      private livraisonService: LivraisonService,
      private detLivraisonService: DetLivraisonService,
      private fournisseurService: FournisseurService,
      private dataService: DataService,
      private router: Router,
      private messageService: MessageService,
      private loadingService: LoadingService
  ) {}

    ngOnInit(): void {
      this.search();
      this.getAllFournisseur();
    }

    initObjectFournisseurSearch(archiver: boolean, supprimer: boolean): Fournisseur {
        let objectSearch: Fournisseur = initObjectFournisseur();

        objectSearch.archiver = archiver;
        objectSearch.supprimer = supprimer;

        return objectSearch;
    }

    search() {
      this.listLivraison = [];
        this.loadingService.show();
        let livraison = initObjectLivraison();
        this.livraisonService.search(livraison).subscribe({
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
          },
          error: (error) => {
              console.log(error);
          },
      });
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    emitToPageUpdate(selectedLivraison: Livraison) {
      if(selectedLivraison) {
        let listDetail: DetLivraison[] = [];
        if(selectedLivraison.id) {
          this.detLivraisonService.getByLivraison(selectedLivraison.id).subscribe({
            next: (details) => {
                listDetail = details;
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.dataService.setLivraisonData({ livraison: selectedLivraison, detLivraisons: listDetail, listFournisseur: this.listFournisseur });
              this.router.navigate(['/update-livraison']);
            }
          });
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

}
