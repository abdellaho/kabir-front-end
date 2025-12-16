import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@/shared/services/data-service';
import { Router } from '@angular/router';
import { initObjectLivraison, Livraison } from '@/models/livraison';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { DetLivraison, initObjectDetLivraison } from '@/models/det-livraison';
import { Subscription } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { LivraisonService } from '@/services/livraison/livraison-service';
import { DetLivraisonService } from '@/services/det-livraison/det-livraison-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initObjectStock, Stock } from '@/models/stock';
import { StockService } from '@/services/stock/stock-service';
import { ajusterMontants, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { Personnel } from '@/models/personnel';
import { LivraisonRequest } from '@/shared/classes/livraison-request';
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

@Component({
  selector: 'app-livraison-update-component',
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
  templateUrl: './livraison-update-component.html',
  styleUrl: './livraison-update-component.scss'
})
export class LivraisonUpdateComponent implements OnInit, OnDestroy {

  livraison: Livraison = initObjectLivraison();
  listFournisseur: Fournisseur[] = [];
  listDetLivraison: DetLivraison[] = [];
  originalListDetLivraison: DetLivraison[] = [];
  listPersonnel: Personnel[] = [];
  listStock: Stock[] = [];
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  mapOfStocks: Map<number, string> = new Map<number, string>();
  mapOfFournisseurs: Map<number, string> = new Map<number, string>();
  subscription!: Subscription;
  dialogStock: boolean = false;
  dialogFacturer: boolean = false;
  dialogRegler: boolean = false;
  dialogDeleteStock: boolean = false;
  detLivraisonSelected: DetLivraison = initObjectDetLivraison();
  stockSelected: Stock = initObjectStock();
  fournisseurSelected: Fournisseur = initObjectFournisseur();
  msg = APP_MESSAGES;
  formGroup!: FormGroup;
  formGroupStock!: FormGroup;
  typeReglements: { label: string, value: number }[] = filteredTypeReglement;

  constructor(
    private livraisonService: LivraisonService,
    private detLivraisonService: DetLivraisonService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    
    this.subscription = this.dataService.currentData$.subscribe((data) => {
      if (!data) {
        this.router.navigate(['/livraison']);
        return;
      }
      this.livraison = data.livraison;
      this.listDetLivraison = data.detLivraisons;
      this.originalListDetLivraison = structuredClone(data.detLivraisons);
      this.listFournisseur = data.listFournisseur;
      this.mapOfFournisseurs = this.listFournisseur.reduce((map, fournisseur) => map.set(Number(fournisseur.id), fournisseur.designation), new Map<number, string>());
      this.listPersonnel = data.listPersonnel;
      this.mapOfPersonnels = this.listPersonnel.reduce((map, personnel) => map.set(Number(personnel.id), personnel.designation), new Map<number, string>());
      this.listStock = data.listStock;
      this.mapOfStocks = this.listStock.reduce((map, stock) => map.set(Number(stock.id), stock.designation), new Map<number, string>());
      this.mapObjectToFormGroup(this.livraison);
    });
  }

  mapObjectToFormGroup(livraison: Livraison) {
    this.formGroup.patchValue(livraison);
    console.log(livraison);
  }

  initFormGroupStock() {
    this.formGroupStock = this.formBuilder.group({
      designation: [{ value: this.stockSelected.designation, disabled: true }],
      pattc: [{ value: this.stockSelected.pattc, disabled: true }],
      qteStock: [{ value: this.stockSelected.qteStock, disabled: true }],
      qteLivrer: [1, [Validators.required, Validators.min(1)]],
      prixVente: [this.stockSelected.pvttc, [Validators.min(0)]],
      remiseLivraison: [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  initFormGroup() {
      this.formGroup = this.formBuilder.group({
        numLivraison: [0],
        codeBl: [{value: '', disabled: true}, [Validators.required]],
        dateBl: [new Date()],
        dateReglement: [new Date()],
        dateReglement2: [null],
        dateReglement3: [null],
        dateReglement4: [null],
        typeReglment: [0],
        typeReglment2: [0],
        typeReglment3: [0],
        typeReglment4: [0],
        mantantBL: [0],
        //mantantBLReel: [0],
        //mantantBLBenefice: [0],
        typePaiement: [''],
        //mantantBLPourcent: [0],
        //reglerNonRegler: [0],
        //sysDate: [new Date()],
        //infinity: [0],
        //etatBultinPaie: [0],
        //livrernonlivrer: [0],
        //avecRemise: [false],
        mntReglement: [0],
        mntReglement2: [0],
        mntReglement3: [0],
        mntReglement4: [0],
        //facturer100: [false],
        //codeTransport: [''],
        personnelId: [0],
        //personnelAncienId: [null],
        fournisseurId: [0],
        stockId: [0],
        fournisseurDesignation: { value: '', disabled: true },
        fournisseurTel1: { value: '', disabled: true },
        fournisseurTel2: { value: '', disabled: true },
        fournisseurICE: { value: '', disabled: true },
      });
  }

  mapFormToLivraison() {
    this.livraison.numLivraison = this.formGroup.get('numLivraison')?.value;
    this.livraison.codeBl = this.formGroup.get('codeBl')?.value;
    this.livraison.dateBl = this.formGroup.get('dateBl')?.value;
    this.livraison.dateReglement = this.formGroup.get('dateReglement')?.value;
    this.livraison.dateReglement2 = this.formGroup.get('dateReglement2')?.value;
    this.livraison.dateReglement3 = this.formGroup.get('dateReglement3')?.value;
    this.livraison.dateReglement4 = this.formGroup.get('dateReglement4')?.value;
    this.livraison.typeReglment = this.formGroup.get('typeReglment')?.value;
    this.livraison.typeReglment2 = this.formGroup.get('typeReglment2')?.value;
    this.livraison.typeReglment3 = this.formGroup.get('typeReglment3')?.value;
    this.livraison.typeReglment4 = this.formGroup.get('typeReglment4')?.value;
    this.livraison.mantantBL = this.formGroup.get('mantantBL')?.value;
    //this.livraison.mantantBLReel = this.formGroup.get('mantantBLReel')?.value;
    //this.livraison.mantantBLBenefice = this.formGroup.get('mantantBLBenefice')?.value;
    // this.livraison.mantantBLPourcent = this.formGroup.get('mantantBLPourcent')?.value;
    //this.livraison.typePaiement = this.formGroup.get('typePaiement')?.value;
    //this.livraison.reglerNonRegler = this.formGroup.get('reglerNonRegler')?.value;
    //this.livraison.infinity = this.formGroup.get('infinity')?.value;
    //this.livraison.etatBultinPaie = this.formGroup.get('etatBultinPaie')?.value;
    //this.livraison.livrernonlivrer = this.formGroup.get('livrernonlivrer')?.value;
    //this.livraison.avecRemise = this.formGroup.get('avecRemise')?.value;
    this.livraison.mntReglement = this.formGroup.get('mntReglement')?.value;
    this.livraison.mntReglement2 = this.formGroup.get('mntReglement2')?.value;
    this.livraison.mntReglement3 = this.formGroup.get('mntReglement3')?.value;
    this.livraison.mntReglement4 = this.formGroup.get('mntReglement4')?.value;
    //this.livraison.facturer100 = this.formGroup.get('facturer100')?.value;
    //this.livraison.codeTransport = this.formGroup.get('codeTransport')?.value;
    this.livraison.personnelId = this.formGroup.get('personnelId')?.value;
    //this.livraison.personnelAncienId = this.formGroup.get('personnelAncienId')?.value;
    this.livraison.fournisseurId = this.formGroup.get('fournisseurId')?.value;
  }

  openCloseDialogStock(openClose: boolean): void {
      this.dialogStock = openClose;
  }

  openCloseDialogDeleteStock(openClose: boolean): void {
    this.dialogDeleteStock = openClose;
  }

  onChangeIdFournisseur() {
    this.fournisseurSelected = this.listFournisseur.find((fournisseur) => fournisseur.id === this.formGroup.get('fournisseurId')?.value) || initObjectFournisseur();
    if(this.fournisseurSelected && this.fournisseurSelected.id !== null && this.fournisseurSelected.id !== undefined) {
      this.formGroup.patchValue({
        fournisseurDesignation: { value: this.fournisseurSelected.designation, disabled: true },
        fournisseurTel1: { value: this.fournisseurSelected.tel1, disabled: true },
        fournisseurTel2: { value: this.fournisseurSelected.tel2, disabled: true },
        fournisseurICE: { value: this.fournisseurSelected.ice, disabled: true },
      })
    } else {
      this.formGroup.patchValue({
        fournisseurDesignation: { value: '', disabled: true },
        fournisseurTel1: { value: '', disabled: true },
        fournisseurTel2: { value: '', disabled: true },
        fournisseurICE: { value: '', disabled: true },
      })
    }
  }

  onChangeIdStock() {
    this.detLivraisonSelected = initObjectDetLivraison();
    this.stockSelected = this.listStock.find((stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
    
    if(this.stockSelected.id !== null && this.stockSelected.id !== undefined) {
      this.detLivraisonSelected.stockId = this.stockSelected.id;
      this.initFormGroupStock();
      this.openCloseDialogStock(true);
    }
  }

  mapFormGroupStockToObject(formGroup: FormGroup, detailLivraison: DetLivraison): DetLivraison {
    detailLivraison.stockId = this.stockSelected.id;
    detailLivraison.stock = this.stockSelected;
    detailLivraison.prixVente = this.formGroupStock.get('prixVente')?.value;
    detailLivraison.qteLivrer = this.formGroupStock.get('qteLivrer')?.value;
    detailLivraison.remiseLivraison = this.formGroupStock.get('remiseLivraison')?.value;
    detailLivraison.avecRemise = this.formGroupStock.get('remiseLivraison')?.value > 0;
    detailLivraison.montantProduit = detailLivraison.prixVente * detailLivraison.qteLivrer;
    
    return detailLivraison;
  }

  updateList(detailLivraison: DetLivraison, list: DetLivraison[], operationType: OperationType, id?: bigint): DetLivraison[] {
      if (operationType === OperationType.ADD) {
          list = [...list, detailLivraison];
      } else if (operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.id === detailLivraison.id);
          if (index > -1) {
              list[index] = detailLivraison;
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.id !== id);
      }
      return list;
  }

  recuppererDetLivraison(operation: number, detLivraisonEdit: DetLivraison) {
    if (detLivraisonEdit && detLivraisonEdit.id) {
        this.detLivraisonSelected = detLivraisonEdit;
        if (operation === 1) {
            this.formGroupStock.patchValue({
                stockId: this.detLivraisonSelected.stockId,
                prixVente: this.detLivraisonSelected.prixVente,
                qteLivrer: this.detLivraisonSelected.qteLivrer,
                remiseLivraison: this.detLivraisonSelected.remiseLivraison
            });

            this.openCloseDialogStock(true);
        } else {
            this.openCloseDialogDeleteStock(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
    }
  }

  validerStock() {
    let trvErreur: boolean = false;
    if(!trvErreur) {
      this.detLivraisonSelected = this.mapFormGroupStockToObject(this.formGroupStock, this.detLivraisonSelected);
      
      if(this.detLivraisonSelected.id) {
        this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.MODIFY, this.detLivraisonSelected.id);
      } else {
        this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.ADD);
      }
      
      this.calculerMontantTotal();
      this.openCloseDialogStock(false);
    }
  }

  recupperer(operation: number, detLivraisonEdit: DetLivraison) {
        if (detLivraisonEdit && detLivraisonEdit.id) {
            this.detLivraisonSelected = detLivraisonEdit;
            if (operation === 1) {
                this.formGroupStock.patchValue({
                    designation: this.detLivraisonSelected.stock?.designation,
                    pattc: this.detLivraisonSelected.stock?.pattc,
                    qteStock: this.detLivraisonSelected.stock?.qteStock,
                    qteLivrer: this.detLivraisonSelected.qteLivrer,
                    prixVente: this.detLivraisonSelected.prixVente,
                    remiseLivraison: this.detLivraisonSelected.remiseLivraison,
                });

                this.openCloseDialogStock(true);
            } else if(operation === 2) {
                this.openCloseDialogDeleteStock(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

  trancherMontantTotal() {
    if(this.livraison && this.livraison.mantantBL > 0) {
      let montantReglement1: number = this.formGroup.get('mntReglement')?.value;
      let montantReglement2: number = this.formGroup.get('dateReglement2')?.value ? this.formGroup.get('mntReglement2')?.value :0;
      let montantReglement3: number = this.formGroup.get('dateReglement3')?.value ? this.formGroup.get('mntReglement3')?.value :0;
      let montantReglement4: number = this.formGroup.get('dateReglement4')?.value ? this.formGroup.get('mntReglement4')?.value :0;
      let montantTotal: number = montantReglement1 + montantReglement2 + montantReglement3 + montantReglement4;
    }
  }

  calculerMontantTotal() {
    if(this.listDetLivraison && this.listDetLivraison.length > 0) {
      this.livraison.mantantBL = this.listDetLivraison.reduce((total, detLivraison) => total + detLivraison.montantProduit, 0);
      this.formGroup.get('mantantBL')?.setValue(this.livraison.mantantBL);
      this.livraison = ajusterMontants(this.livraison, this.livraison.mantantBL);
      this.formGroup.patchValue({
        mntReglement: this.livraison.mntReglement,
        mntReglement2: this.livraison.mntReglement2,
        mntReglement3: this.livraison.mntReglement3,
        mntReglement4: this.livraison.mntReglement4
      });
    }
  }

  deleteDetLivraison() {
    this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.DELETE, this.detLivraisonSelected.id);
  }

  mapFormGroupToObject(formGroup: FormGroup, livraison: Livraison): Livraison {
      livraison.dateBl = mapToDateTimeBackEnd(formGroup.get('dateBl')?.value);
      livraison.dateReglement = mapToDateTimeBackEnd(formGroup.get('dateReglement')?.value);
      livraison.dateReglement2 = mapToDateTimeBackEnd(formGroup.get('dateReglement2')?.value);
      livraison.dateReglement3 = mapToDateTimeBackEnd(formGroup.get('dateReglement3')?.value);
      livraison.dateReglement4 = mapToDateTimeBackEnd(formGroup.get('dateReglement4')?.value);
      livraison.personnelId = formGroup.get('personnelId')?.value;
      livraison.fournisseurId = formGroup.get('fournisseurId')?.value;
      livraison.typeReglment = formGroup.get('typeReglment')?.value;
      livraison.typeReglment2 = formGroup.get('typeReglment2')?.value;
      livraison.typeReglment3 = formGroup.get('typeReglment3')?.value;
      livraison.typeReglment4 = formGroup.get('typeReglment4')?.value;
      livraison.mantantBL = formGroup.get('mantantBL')?.value;
      livraison.mntReglement = formGroup.get('mntReglement')?.value;
      livraison.mntReglement2 = formGroup.get('mntReglement2')?.value;
      livraison.mntReglement3 = formGroup.get('mntReglement3')?.value;
      livraison.mntReglement4 = formGroup.get('mntReglement4')?.value;

      return livraison;
  }

  updateQteStock(listDetLivraison: DetLivraison[], operationType: OperationType) {
    if(listDetLivraison && listDetLivraison.length > 0) {
      listDetLivraison.forEach((detLivraison: DetLivraison) => {
        if(detLivraison.stockId) {
          this.stockService.updateQteStock(detLivraison.stockId, detLivraison.qteLivrer, operationType).subscribe({
            next: () => {
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      });
    }
  }

  updateStock(detLivraisonToAdd: DetLivraison[], detLivraisonToModify: DetLivraison[], detLivraisonToDelete: DetLivraison[]) {
      if(detLivraisonToDelete && detLivraisonToDelete.length > 0) {
        this.updateQteStock(detLivraisonToDelete, OperationType.DELETE);
      }

      if(detLivraisonToModify && detLivraisonToModify.length > 0) {
        this.updateQteStock(detLivraisonToModify, OperationType.DELETE);
      }
      
      if(detLivraisonToAdd && detLivraisonToAdd.length > 0) {
        this.updateQteStock(detLivraisonToAdd, OperationType.ADD);
      }
  }

  deleteListDetLivraison(detLivraisonToDelete: DetLivraison[]) {
    if(detLivraisonToDelete && detLivraisonToDelete.length > 0) {
      detLivraisonToDelete.forEach((detLivraison: DetLivraison) => {
        this.detLivraisonService.delete(detLivraison.id).subscribe({
          next: () => {
          }, error: (err) => {
            console.log(err);
          }
        });
      });
    }
  }

  miseAjour() {
    let trvErreur: boolean = false;
    if(!trvErreur) {
      this.livraison = this.mapFormGroupToObject(this.formGroup, this.livraison);

      let livraisonRequest: LivraisonRequest = {
        livraison: this.livraison,
        detLivraisons: this.listDetLivraison
      };
      
      if(this.livraison.id) {
        let detLivraisonToDelete: DetLivraison[] = this.originalListDetLivraison.filter((detLivraisonOriginal: DetLivraison) => !this.listDetLivraison.some((detLivraison: DetLivraison) => detLivraison.id === detLivraisonOriginal.id));
        let detLivraisonToModify: DetLivraison[] = this.listDetLivraison.filter((detLivraison: DetLivraison) => detLivraison.id !== null);
        
        this.livraisonService.update(this.livraison.id, livraisonRequest).subscribe({
          next: (data: Livraison) => {
            this.messageService.add({
              severity: 'success',
              summary: this.msg.summary.labelSuccess,
              detail: this.msg.messages.messageUpdateSuccess,
            });
            this.router.navigate(['/livraison']);
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

        this.updateStock(this.listDetLivraison, detLivraisonToModify, detLivraisonToDelete);
        this.deleteListDetLivraison(detLivraisonToDelete);
      } else {
        this.livraisonService.create(livraisonRequest).subscribe({
          next: (data: Livraison) => {
            this.messageService.add({
              severity: 'success',
              summary: this.msg.summary.labelSuccess,
              detail: this.msg.messages.messageAddSuccess,
            });
            this.router.navigate(['/livraison']);
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

        this.updateStock(this.listDetLivraison, [], []);
      }
    }
  }

  fermer() {
    this.router.navigate(['/livraison']);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
