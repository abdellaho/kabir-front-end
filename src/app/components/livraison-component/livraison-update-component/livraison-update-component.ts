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
import { ajusterMontants, findInvalidControls, getAllInvalidFields, getPrixVenteMin, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
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
import { DetLivraisonValidator } from '@/validators/det-livraison-validator';
import { LivraisonValidator } from '@/validators/livraison-validator';

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
    this.initFormGroupStock();
    this.initFormGroup();
    
    this.subscription = this.dataService.currentData$.subscribe((data) => {
      if (!data) {
        this.router.navigate(['/livraison']);
        return;
      }
      this.livraison = this.adjustLivraison(data.livraison);
      this.listDetLivraison = data.detLivraisons;
      this.originalListDetLivraison = structuredClone(data.detLivraisons);
      this.listFournisseur = [initObjectFournisseur(), ...data.listFournisseur];
      this.mapOfFournisseurs = this.listFournisseur.reduce((map, fournisseur) => map.set(Number(fournisseur.id), fournisseur.designation), new Map<number, string>());
      this.listPersonnel = [initObjectPersonnel(), ...data.listPersonnel];
      this.mapOfPersonnels = this.listPersonnel.reduce((map, personnel) => map.set(Number(personnel.id), personnel.designation), new Map<number, string>());
      this.listStock = [initObjectStock(), ...data.listStock];
      this.mapOfStocks = this.listStock.reduce((map, stock) => map.set(Number(stock.id), stock.designation), new Map<number, string>());
      this.mapObjectToFormGroup(this.livraison);
      this.fournisseurSelected = this.listFournisseur.find((fournisseur) => fournisseur.id === this.livraison.fournisseurId) || initObjectFournisseur();
      this.adjustDetLivraison();
    });
  }

  adjustLivraison(livraison: Livraison): Livraison {
    livraison.dateBl = new Date(livraison.dateBl);
    livraison.dateReglement = new Date(livraison.dateReglement);
    livraison.dateReglement2 = livraison.dateReglement2 ? new Date(livraison.dateReglement2) : null;
    livraison.dateReglement3 = livraison.dateReglement3 ? new Date(livraison.dateReglement3) : null;
    livraison.dateReglement4 = livraison.dateReglement4 ? new Date(livraison.dateReglement4) : null;
    
    return livraison;
  }

  adjustDetLivraison() {
    this.listDetLivraison.forEach((detLivraison: DetLivraison) => {
      detLivraison.stock = this.listStock.find((stock) => stock.id === detLivraison.stockId) || initObjectStock();
    });
  }

  mapObjectToFormGroup(livraison: Livraison) {
    this.fournisseurSelected = this.listFournisseur.find((fournisseur) => fournisseur.id === livraison.fournisseurId) || initObjectFournisseur();
    this.formGroup.patchValue({
      numLivraison: livraison.numLivraison,
      codeBl: livraison.codeBl,
      dateBl: livraison.dateBl,
      dateReglement: livraison.dateReglement,
      dateReglement2: livraison.dateReglement2,
      dateReglement3: livraison.dateReglement3,
      dateReglement4: livraison.dateReglement4,
      typeReglment: livraison.typeReglment,
      typeReglment2: livraison.typeReglment2,
      typeReglment3: livraison.typeReglment3,
      typeReglment4: livraison.typeReglment4,
      mntReglement: livraison.mntReglement,
      mntReglement2: livraison.mntReglement2,
      mntReglement3: livraison.mntReglement3,
      mntReglement4: livraison.mntReglement4,
      mantantBL: livraison.mantantBL,
      personnelId: livraison.personnelId,
      fournisseurId: this.fournisseurSelected?.id,
      fournisseurDesignation: this.fournisseurSelected?.designation || '',
      fournisseurTel1: this.fournisseurSelected?.tel1 || '',
      fournisseurTel2: this.fournisseurSelected?.tel2 || '',
      fournisseurICE: this.fournisseurSelected?.ice || '',
    });
    this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetLivraison is set
  }

  initFormGroupStock() {
    this.formGroupStock = this.formBuilder.group({
      designation: [{ value: this.stockSelected.designation, disabled: true }],
      pattc: [{ value: this.stockSelected.pattc, disabled: true }],
      pvttc: [{ value: this.stockSelected.pvttc, disabled: true }],
      qteStock: [{ value: this.stockSelected.qteStock, disabled: true }],
      prixVenteMin: [{ value: getPrixVenteMin(this.stockSelected), disabled: true }],
      qteLivrer: [1, [Validators.required, Validators.min(1)]],
      prixVente: [this.stockSelected.pvttc, [Validators.min(0)]],
      remiseLivraison: [0, [Validators.min(0), Validators.max(100)]],
      montantProduit: [0, [Validators.min(0)]],
    }, { validators: DetLivraisonValidator({ stock: this.stockSelected }) });
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      numLivraison: [0],
      codeBl: [{value: '', disabled: true}, [Validators.required]],
      dateBl: [new Date(), [Validators.required]],
      dateReglement: [new Date(), [Validators.required]],
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
      //typePaiement: [''],
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
      personnelId: [0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }],
      //personnelAncienId: [null],
      fournisseurId: [0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }],
      stockId: [0],
      fournisseurDesignation: [{ value: '', disabled: true }],
      fournisseurTel1: [{ value: '', disabled: true }],
      fournisseurTel2: [{ value: '', disabled: true }],
      fournisseurICE: [{ value: '', disabled: true }],
    }, { validators: LivraisonValidator({ getListDetLivraison: () => this.listDetLivraison }) });
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

  disableFournisseurData() {
    this.formGroup.get('fournisseurDesignation')?.disable();
    this.formGroup.get('fournisseurTel1')?.disable();
    this.formGroup.get('fournisseurTel2')?.disable();
    this.formGroup.get('fournisseurICE')?.disable();
  }

  onChangeIdFournisseur() {
    this.fournisseurSelected = this.listFournisseur.find((fournisseur) => fournisseur.id === this.formGroup.get('fournisseurId')?.value) || initObjectFournisseur();
    
    if(this.fournisseurSelected && this.fournisseurSelected.id !== null && this.fournisseurSelected.id !== undefined) {
      this.formGroup.patchValue({
        fournisseurDesignation: this.fournisseurSelected.designation,
        fournisseurTel1: this.fournisseurSelected.tel1,
        fournisseurTel2: this.fournisseurSelected.tel2,
        fournisseurICE: this.fournisseurSelected.ice,
      });

      this.disableFournisseurData();
    } else {
      this.formGroup.patchValue({
        fournisseurDesignation: '',
        fournisseurTel1: '',
        fournisseurTel2: '',
        fournisseurICE: '',
      });

      this.disableFournisseurData();
    }
  }

  onChangeIdStock() {
    this.detLivraisonSelected = this.listDetLivraison.find((detLivraison) => detLivraison.stockId === this.formGroup.get('stockId')?.value) || initObjectDetLivraison();
    this.stockSelected = this.listStock.find((stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
    
    if(this.stockSelected.id !== null && this.stockSelected.id !== undefined) {
      if(this.detLivraisonSelected.stockId === null) {
        this.detLivraisonSelected.stockId = this.stockSelected.id;
      }
      
      this.initFormGroupStock();
      this.onChangeMontantProduit();
      this.openCloseDialogStock(true);
    }
  }

  mapFormGroupStockToObject(formGroup: FormGroup, detailLivraison: DetLivraison): DetLivraison {
    detailLivraison.stockId = this.stockSelected.id;
    detailLivraison.stock = this.stockSelected;
    detailLivraison.prixVente = formGroup.get('prixVente')?.value;
    detailLivraison.qteLivrer = formGroup.get('qteLivrer')?.value;
    detailLivraison.remiseLivraison = formGroup.get('remiseLivraison')?.value;
    detailLivraison.avecRemise = formGroup.get('remiseLivraison')?.value > 0;
    detailLivraison.montantProduit = formGroup.get('montantProduit')?.value;
    
    return detailLivraison;
  }

  updateList(detailLivraison: DetLivraison, list: DetLivraison[], operationType: OperationType, stockId?: bigint): DetLivraison[] {
      if (operationType === OperationType.ADD) {
          list = [...list, detailLivraison];
      } else if (operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.stockId === detailLivraison.stockId);
          if (index > -1) {
              list[index] = detailLivraison;
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.stockId !== stockId);
      }
      return list;
  }

  recuppererDetLivraison(operation: number, detLivraisonEdit: DetLivraison) {
    if (detLivraisonEdit && detLivraisonEdit.id) {
        this.detLivraisonSelected = detLivraisonEdit;
        if (operation === 1) {
          this.initFormGroupStock();
          this.stockSelected = this.listStock.find(x => x.id === this.detLivraisonSelected.stockId) || initObjectStock();
          this.detLivraisonSelected.stock = this.stockSelected;

          this.formGroupStock.patchValue({
            designation: this.stockSelected.designation,
            pattc: this.stockSelected.pattc,
            pvttc: this.stockSelected.pvttc,
            qteStock: this.stockSelected.qteStock,
            prixVenteMin: getPrixVenteMin(this.stockSelected),
            prixVente: this.detLivraisonSelected.prixVente,
            qteLivrer: this.detLivraisonSelected.qteLivrer,
            remiseLivraison: this.detLivraisonSelected.remiseLivraison,
            montantProduit: this.detLivraisonSelected.montantProduit
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
        montantProduit: this.formGroupStock.get('prixVente')?.value * this.formGroupStock.get('qteLivrer')?.value
    });
  }

  validerStock() {
    let trvErreur: boolean = false;
    if(!trvErreur) {
      this.detLivraisonSelected = this.mapFormGroupStockToObject(this.formGroupStock, this.detLivraisonSelected);
      
      if(this.detLivraisonSelected.stockId) {
        let exist: boolean = this.listDetLivraison.some((detLivraison: DetLivraison) => detLivraison.stockId === this.detLivraisonSelected.stockId);
        
        if(exist) {
          this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.MODIFY, this.detLivraisonSelected.stockId);
        } else {
          this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.ADD);
        }
      }
      
      this.calculerMontantTotal();
      this.stockSelected = initObjectStock();
      this.formGroup.patchValue({ stockId: null });
      this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetLivraison changes
      this.openCloseDialogStock(false);
    }
  }

  recupperer(operation: number, detLivraisonEdit: DetLivraison) {
    if (detLivraisonEdit && detLivraisonEdit.stockId) {
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

  getReglementDataFromFormGroup(livraison: Livraison, formGroup: FormGroup) {
    livraison.dateReglement = formGroup.get('dateReglement')?.value;
    livraison.dateReglement2 = formGroup.get('dateReglement2')?.value;
    livraison.dateReglement3 = formGroup.get('dateReglement3')?.value;
    livraison.dateReglement4 = formGroup.get('dateReglement4')?.value;
    livraison.mntReglement = formGroup.get('mntReglement')?.value;
    livraison.mntReglement2 = formGroup.get('mntReglement2')?.value;
    livraison.mntReglement3 = formGroup.get('mntReglement3')?.value;
    livraison.mntReglement4 = formGroup.get('mntReglement4')?.value;
  }

  patchMontantReglement(livraison: Livraison, formGroup: FormGroup) {
    formGroup.patchValue({
      mntReglement: livraison.mntReglement,
      mntReglement2: livraison.mntReglement2,
      mntReglement3: livraison.mntReglement3,
      mntReglement4: livraison.mntReglement4
    });
  }

  calculerMontantTotal() {
    this.livraison.mantantBL = this.listDetLivraison.reduce((total: number, detLivraison: DetLivraison) => total + Number(detLivraison.montantProduit), 0);
    this.formGroup.get('mantantBL')?.setValue(this.livraison.mantantBL);
    this.getReglementDataFromFormGroup(this.livraison, this.formGroup);
    this.livraison = ajusterMontants(this.livraison, this.livraison.mantantBL);
    this.patchMontantReglement(this.livraison, this.formGroup);
  }

  deleteDetLivraison() {
    let stockId: bigint = this.detLivraisonSelected?.stockId || 0n;
    this.listDetLivraison = this.updateList(this.detLivraisonSelected, this.listDetLivraison, OperationType.DELETE, stockId);
    this.calculerMontantTotal();
    this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetLivraison changes
    this.openCloseDialogDeleteStock(false);
  }

  mapFormGroupToObject(formGroup: FormGroup, livraison: Livraison): Livraison {
      livraison.dateBl = mapToDateTimeBackEnd(formGroup.get('dateBl')?.value);
      livraison.dateReglement = mapToDateTimeBackEnd(formGroup.get('dateReglement')?.value);
      livraison.dateReglement2 = formGroup.get('dateReglement2')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement2')?.value) : null;
      livraison.dateReglement3 = formGroup.get('dateReglement3')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement3')?.value) : null;
      livraison.dateReglement4 = formGroup.get('dateReglement4')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement4')?.value) : null;
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

  updateStock(detLivraisonToAdd: DetLivraison[], detLivraisonToModify: DetLivraison[], detLivraisonToDelete: DetLivraison[], detLivraisonChanged: DetLivraison[]) {
      if(detLivraisonToDelete && detLivraisonToDelete.length > 0) {
        console.log('detLivraisonToDelete', detLivraisonToDelete);
        this.updateQteStock(detLivraisonToDelete, OperationType.DELETE);
      }

      if(detLivraisonChanged && detLivraisonChanged.length > 0) {
        console.log('detLivraisonChanged', detLivraisonChanged);
        this.updateQteStock(detLivraisonChanged, OperationType.DELETE);
      }

      if(detLivraisonToModify && detLivraisonToModify.length > 0) {
        console.log('detLivraisonToModify', detLivraisonToModify);
        this.updateQteStock(detLivraisonToModify, OperationType.ADD);
      }
      
      if(detLivraisonToAdd && detLivraisonToAdd.length > 0) {
        console.log('detLivraisonToAdd', detLivraisonToAdd);
        this.updateQteStock(detLivraisonToAdd, OperationType.ADD);
      }
  }

  deleteListDetLivraison(detLivraisonToDelete: DetLivraison[]) {
    if(detLivraisonToDelete && detLivraisonToDelete.length > 0) {
      detLivraisonToDelete.forEach((detLivraison: DetLivraison) => {
        let id: bigint = detLivraison.id ? detLivraison.id : BigInt(0);
        this.detLivraisonService.delete(id).subscribe({
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
        let detLivraisonToAdd: DetLivraison[] = this.listDetLivraison.filter((detLivraison: DetLivraison) => detLivraison.id === null);
        let detLivraisonToDelete: DetLivraison[] = this.originalListDetLivraison.filter((detLivraisonOriginal: DetLivraison) => !this.listDetLivraison.some((detLivraison: DetLivraison) => detLivraison.id === detLivraisonOriginal.id));
        let detLivraisonChanged: DetLivraison[] = this.originalListDetLivraison.filter((detLivraisonOriginal: DetLivraison) => this.listDetLivraison.some((detLivraison: DetLivraison) => detLivraison.id === detLivraisonOriginal.id));
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

        this.updateStock(detLivraisonToAdd, detLivraisonToModify, detLivraisonToDelete, detLivraisonChanged);
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

        this.updateStock(this.listDetLivraison, [], [], []);
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
