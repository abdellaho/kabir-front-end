import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@/shared/services/data-service';
import { Router } from '@angular/router';
import { Facture, initObjectFacture } from '@/models/facture';
import { DetFacture, initObjectDetFacture } from '@/models/det-facture';
import { Subscription, concatMap, delay, from } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { FactureService } from '@/services/facture/facture-service';
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
import { initObjectRepertoire, Repertoire } from '@/models/repertoire';
import { FactureValidator } from '@/validators/facture-validator';
import { FactureRequest } from '@/shared/classes/facture-request';
import { DetFactureValidator } from '@/validators/det-facture-validator';

@Component({
  selector: 'app-facture-update-component',
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
  templateUrl: './facture-update-component.html',
  styleUrl: './facture-update-component.scss'
})
export class FactureUpdateComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  etablissement: Etablissement = initObjectEtablissement();
  facture: Facture = initObjectFacture();
  listRepertoire: Repertoire[] = [];
  listDetFacture: DetFacture[] = [];
  listPersonnel: Personnel[] = [];
  listStock: Stock[] = [];
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  mapOfStocks: Map<number, string> = new Map<number, string>();
  mapOfRepertoire: Map<number, string> = new Map<number, string>();
  subscription!: Subscription;
  dialogStock: boolean = false;
  dialogFacturer: boolean = false;
  dialogRegler: boolean = false;
  dialogDeleteStock: boolean = false;
  detFactureSelected: DetFacture = initObjectDetFacture();
  stockSelected: Stock = initObjectStock();
  repertoireSelected: Repertoire = initObjectRepertoire();
  msg = APP_MESSAGES;
  formGroup!: FormGroup;
  formGroupStock!: FormGroup;
  typeReglements: { label: string, value: number }[] = filteredTypeReglement;

  constructor(
    private factureService: FactureService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private messageService: MessageService,
    private etablissementService: EtablissementService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.submitted = false;
    this.initFormGroupStock();
    this.initFormGroup();
    
    this.subscription = this.dataService.currentFacture$.subscribe((data) => {
      if (!data) {
        this.router.navigate(['/facture']);
        return;
      }
      this.getEtablissement();
      this.facture = this.adjustFacture(data.facture);
      this.listDetFacture = data.detFactures;
      this.listRepertoire = [initObjectRepertoire(), ...data.listRepertoire];
      this.mapOfRepertoire = this.listRepertoire.reduce((map, repertoire) => map.set(Number(repertoire.id), repertoire.designation), new Map<number, string>());
      this.listPersonnel = [initObjectPersonnel(), ...data.listPersonnel];
      this.mapOfPersonnels = this.listPersonnel.reduce((map, personnel) => map.set(Number(personnel.id), personnel.designation), new Map<number, string>());
      this.listStock = [initObjectStock(), ...data.listStock];
      this.mapOfStocks = this.listStock.reduce((map, stock) => map.set(Number(stock.id), stock.designation), new Map<number, string>());
      this.mapObjectToFormGroup(this.facture);
      this.repertoireSelected = this.listRepertoire.find((repertoire) => repertoire.id === this.facture.repertoireId) || initObjectRepertoire();
      this.adjustDetFacture();
    });
  }

  getEtablissement() {
    this.etablissementService.getAll().subscribe({
      next: (data: Etablissement[]) => {
        this.etablissement = data[0];
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  adjustFacture(facture: Facture): Facture {
    facture.dateBF = new Date(facture.dateBF);
    facture.dateReglement = new Date(facture.dateReglement);
    facture.dateReglement2 = facture.dateReglement2 ? new Date(facture.dateReglement2) : null;
    facture.dateReglement3 = facture.dateReglement3 ? new Date(facture.dateReglement3) : null;
    facture.dateReglement4 = facture.dateReglement4 ? new Date(facture.dateReglement4) : null;
    
    return facture;
  }

  adjustDetFacture() {  
    this.listDetFacture.forEach((detLivraison: DetFacture) => {
      detLivraison.stock = this.listStock.find((stock) => stock.id === detLivraison.stockId) || initObjectStock();
    });
    this.formGroup.patchValue({
      detLivraisons: this.listDetFacture,
    });
  }

  mapObjectToFormGroup(facture: Facture) {
    this.repertoireSelected = this.listRepertoire.find((repertoire) => repertoire.id === facture.repertoireId) || initObjectRepertoire();
    this.formGroup.patchValue({
      numFacture: facture.numFacture,
      codeBF: facture.codeBF,
      dateBF: facture.dateBF,
      dateReglement: facture.dateReglement,
      dateReglement2: facture.dateReglement2,
      dateReglement3: facture.dateReglement3,
      dateReglement4: facture.dateReglement4,
      typeReglment: facture.typeReglment,
      typeReglment2: facture.typeReglment2,
      typeReglment3: facture.typeReglment3,
      typeReglment4: facture.typeReglment4,
      numCheque: facture.numCheque,
      numCheque2: facture.numCheque2,
      numCheque3: facture.numCheque3,
      numCheque4: facture.numCheque4,
      mntReglement: facture.mntReglement,
      mntReglement2: facture.mntReglement2,
      mntReglement3: facture.mntReglement3,
      mntReglement4: facture.mntReglement4,
      mantantBF: facture.mantantBF,
      personnelId: facture.personnelId,
      repertoireId: this.repertoireSelected?.id,
      repertoireDesignation: this.repertoireSelected?.designation || '',
      repertoireTel1: this.repertoireSelected?.tel1 || '',
      repertoireTel2: this.repertoireSelected?.tel2 || '',
      repertoireICE: this.repertoireSelected?.ice || '',
    });
    this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetFacture is set
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
      remiseFacture: [0, [Validators.min(0), Validators.max(100)]],
      montantProduit: [0, [Validators.min(0)]],
    }, { validators: DetFactureValidator({ stock: this.stockSelected }) });
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      numFacture: [0],
      codeBF: [{value: '', disabled: true}, [Validators.required]],
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
      repertoireId: [0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }],
      stockId: [0],
      repertoireDesignation: [{ value: '', disabled: true }],
      repertoireTel1: [{ value: '', disabled: true }],
      repertoireTel2: [{ value: '', disabled: true }],
      repertoireICE: [{ value: '', disabled: true }],
    }, { validators: FactureValidator({ getListDetFacture: () => this.listDetFacture }) });
  }

  mapFormToLivraison() {
    this.facture.numFacture = this.formGroup.get('numFacture')?.value;
    this.facture.codeBF = this.formGroup.get('codeBF')?.value;
    this.facture.dateBF = this.formGroup.get('dateBF')?.value;
    this.facture.dateReglement = this.formGroup.get('dateReglement')?.value;
    this.facture.dateReglement2 = this.formGroup.get('dateReglement2')?.value;
    this.facture.dateReglement3 = this.formGroup.get('dateReglement3')?.value;
    this.facture.dateReglement4 = this.formGroup.get('dateReglement4')?.value;
    this.facture.typeReglment = this.formGroup.get('typeReglment')?.value;
    this.facture.typeReglment2 = this.formGroup.get('typeReglment2')?.value;
    this.facture.typeReglment3 = this.formGroup.get('typeReglment3')?.value;
    this.facture.typeReglment4 = this.formGroup.get('typeReglment4')?.value;
    this.facture.numCheque = this.formGroup.get('numCheque')?.value;
    this.facture.numCheque2 = this.formGroup.get('numCheque2')?.value;
    this.facture.numCheque3 = this.formGroup.get('numCheque3')?.value;
    this.facture.numCheque4 = this.formGroup.get('numCheque4')?.value;
    this.facture.mantantBF = this.formGroup.get('mantantBF')?.value;
    //this.facture.mantantBLReel = this.formGroup.get('mantantBLReel')?.value;
    //this.facture.mantantBLBenefice = this.formGroup.get('mantantBLBenefice')?.value;
    // this.facture.mantantBLPourcent = this.formGroup.get('mantantBLPourcent')?.value;
    //this.facture.typePaiement = this.formGroup.get('typePaiement')?.value;
    //this.facture.reglerNonRegler = this.formGroup.get('reglerNonRegler')?.value;
    //this.facture.infinity = this.formGroup.get('infinity')?.value;
    //this.facture.etatBultinPaie = this.formGroup.get('etatBultinPaie')?.value;
    //this.facture.livrernonlivrer = this.formGroup.get('livrernonlivrer')?.value;
    //this.facture.avecRemise = this.formGroup.get('avecRemise')?.value;
    this.facture.mntReglement = this.formGroup.get('mntReglement')?.value;
    this.facture.mntReglement2 = this.formGroup.get('mntReglement2')?.value;
    this.facture.mntReglement3 = this.formGroup.get('mntReglement3')?.value;
    this.facture.mntReglement4 = this.formGroup.get('mntReglement4')?.value;
    //this.facture.facturer100 = this.formGroup.get('facturer100')?.value;
    //this.facture.codeTransport = this.formGroup.get('codeTransport')?.value;
    this.facture.personnelId = this.formGroup.get('personnelId')?.value;
    //this.facture.personnelAncienId = this.formGroup.get('personnelAncienId')?.value;
    this.facture.repertoireId = this.formGroup.get('repertoireId')?.value;
  }

  openCloseDialogStock(openClose: boolean): void {
      this.dialogStock = openClose;
  }

  openCloseDialogDeleteStock(openClose: boolean): void {
    this.dialogDeleteStock = openClose;
  }

  disableRepertoireData() {
    this.formGroup.get('repertoireDesignation')?.disable();
    this.formGroup.get('repertoireTel1')?.disable();
    this.formGroup.get('repertoireTel2')?.disable();
    this.formGroup.get('repertoireICE')?.disable();
  }

  onChangeIdRepertoire() {
    this.repertoireSelected = this.listRepertoire.find((repertoire) => repertoire.id === this.formGroup.get('repertoireId')?.value) || initObjectRepertoire();
    
    if(this.repertoireSelected && this.repertoireSelected.id !== null && this.repertoireSelected.id !== undefined) {
      this.formGroup.patchValue({
        repertoireDesignation: this.repertoireSelected.designation,
        repertoireTel1: this.repertoireSelected.tel1,
        repertoireTel2: this.repertoireSelected.tel2,
        repertoireICE: this.repertoireSelected.ice,
      });

      this.disableRepertoireData();
    } else {
      this.formGroup.patchValue({
        repertoireDesignation: '',
        repertoireTel1: '',
        repertoireTel2: '',
        repertoireICE: '',
      });

      this.disableRepertoireData();
    }
  }

  onChangeIdStock() {
    this.detFactureSelected = this.listDetFacture.find((detFacture) => detFacture.stockId === this.formGroup.get('stockId')?.value) || initObjectDetFacture();
    this.stockSelected = this.listStock.find((stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
    
    if(this.stockSelected.id !== null && this.stockSelected.id !== undefined) {
      if(this.detFactureSelected.stockId === null) {
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
          let index = list.findIndex(x => x.stockId === detailFacture.stockId);
          if (index > -1) {
              list[index] = structuredClone(detailFacture);
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.stockId !== stockId);
      }
      return list;
  }

  recuppererDetFacture(operation: number, detFactureEdit: DetFacture) {
    if (detFactureEdit && detFactureEdit.stockId) {
        this.detFactureSelected = structuredClone(detFactureEdit);
        if (operation === 1) {
          this.initFormGroupStock();
          this.stockSelected = this.listStock.find(x => x.id === this.detFactureSelected.stockId) || initObjectStock();
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
        montantProduit: this.formGroupStock.get('prixVente')?.value * this.formGroupStock.get('qteLivrer')?.value
    });
  }

  validerStock() {
    let updatedDetLivraison = structuredClone(this.detFactureSelected);
    
    updatedDetLivraison = this.mapFormGroupStockToObject(this.formGroupStock, updatedDetLivraison);

    if(updatedDetLivraison.stockId) {
      let exist: boolean = this.listDetFacture.some((detLivraison: DetFacture) => detLivraison.stockId === updatedDetLivraison.stockId);
      
      if(exist) {
        this.listDetFacture = this.updateList(updatedDetLivraison, this.listDetFacture, OperationType.MODIFY, updatedDetLivraison.stockId);
      } else {
        this.listDetFacture = this.updateList(updatedDetLivraison, this.listDetFacture, OperationType.ADD);
      }
    }
    
    this.calculerMontantTotal();
    this.stockSelected = initObjectStock();
    this.formGroup.patchValue({ stockId: null });
    this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetFacture changes
    this.openCloseDialogStock(false);
  }

  recupperer(operation: number, detLivraisonEdit: DetFacture) {
    if (detLivraisonEdit && detLivraisonEdit.stockId) {
      this.detFactureSelected = structuredClone(detLivraisonEdit);
      if (operation === 1) {
          this.formGroupStock.patchValue({
              designation: this.detFactureSelected.stock?.designation,
              pattc: this.detFactureSelected.stock?.pattc,
              qteStock: this.detFactureSelected.stock?.qteStock,
              qteFacturer: this.detFactureSelected.qteFacturer,
              prixVente: this.detFactureSelected.prixVente,
              remiseFacture: this.detFactureSelected.remiseFacture,
          });
          this.openCloseDialogStock(true);
      } else if(operation === 2) {
          this.openCloseDialogDeleteStock(true);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
    }
  }

  getReglementDataFromFormGroup(facture: Facture, formGroup: FormGroup) {
    facture.dateReglement = formGroup.get('dateReglement')?.value;
    facture.dateReglement2 = formGroup.get('dateReglement2')?.value;
    facture.dateReglement3 = formGroup.get('dateReglement3')?.value;
    facture.dateReglement4 = formGroup.get('dateReglement4')?.value;
    facture.mntReglement = formGroup.get('mntReglement')?.value;
    facture.mntReglement2 = formGroup.get('mntReglement2')?.value;
    facture.mntReglement3 = formGroup.get('mntReglement3')?.value;
    facture.mntReglement4 = formGroup.get('mntReglement4')?.value;
  }

  patchMontantReglement(facture: Facture, formGroup: FormGroup) {
    formGroup.patchValue({
      mntReglement: facture.mntReglement,
      mntReglement2: facture.mntReglement2,
      mntReglement3: facture.mntReglement3,
      mntReglement4: facture.mntReglement4
    });
  }

  calculerMontantTotal() {
    this.facture.mantantBF = this.listDetFacture.reduce((total: number, detFacture: DetFacture) => total + Number(detFacture.montantProduit), 0);
    this.formGroup.get('mantantBF')?.setValue(this.facture.mantantBF);
    this.getReglementDataFromFormGroup(this.facture, this.formGroup);
    this.facture = ajusterMontantsFacture(this.facture, this.facture.mantantBF);
    this.patchMontantReglement(this.facture, this.formGroup);
  }

  deleteDetFacture() {
    let stockId: bigint = this.detFactureSelected?.stockId || 0n;
    this.listDetFacture = this.updateList(this.detFactureSelected, this.listDetFacture, OperationType.DELETE, stockId);
    this.calculerMontantTotal();
    this.formGroup.updateValueAndValidity(); // Trigger re-validation after listDetFacture changes
    this.openCloseDialogDeleteStock(false);
  }

  mapFormGroupToObject(formGroup: FormGroup, facture: Facture): Facture {
      facture.dateBF = mapToDateTimeBackEnd(formGroup.get('dateBF')?.value);
      facture.dateReglement = mapToDateTimeBackEnd(formGroup.get('dateReglement')?.value);
      facture.dateReglement2 = formGroup.get('dateReglement2')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement2')?.value) : null;
      facture.dateReglement3 = formGroup.get('dateReglement3')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement3')?.value) : null;
      facture.dateReglement4 = formGroup.get('dateReglement4')?.value ? mapToDateTimeBackEnd(formGroup.get('dateReglement4')?.value) : null;
      facture.personnelId = formGroup.get('personnelId')?.value;
      facture.repertoireId = formGroup.get('repertoireId')?.value;
      facture.typeReglment = formGroup.get('typeReglment')?.value;
      facture.typeReglment2 = formGroup.get('typeReglment2')?.value;
      facture.typeReglment3 = formGroup.get('typeReglment3')?.value;
      facture.typeReglment4 = formGroup.get('typeReglment4')?.value;
      facture.mantantBF = formGroup.get('mantantBF')?.value;
      facture.mntReglement = formGroup.get('mntReglement')?.value;
      facture.mntReglement2 = formGroup.get('mntReglement2')?.value;
      facture.mntReglement3 = formGroup.get('mntReglement3')?.value;
      facture.mntReglement4 = formGroup.get('mntReglement4')?.value;

      return facture;
  }

  updateQteStock(listDetFacture: DetFacture[], operationType: OperationType) {
    if(listDetFacture && listDetFacture.length > 0) {
      // Filter items that have a stockId
      const itemsToUpdate = listDetFacture.filter(detLivraison => detLivraison.stockId);
      
      // Process each item sequentially with 1 second delay between requests
      from(itemsToUpdate).pipe(
        concatMap((detLivraison: DetFacture, index: number) => 
          this.stockService.updateQteStock(detLivraison.stockId!, detLivraison.qteFacturer, operationType).pipe(
            delay(index === itemsToUpdate.length - 1 ? 0 : 1000) // No delay after the last item
          )
        )
      ).subscribe({
        next: () => {
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  updateStock(detLivraisonToAdd: DetFacture[], detLivraisonToModify: DetFacture[], detLivraisonToDelete: DetFacture[], detLivraisonChanged: DetFacture[]) {
    if(detLivraisonToDelete && detLivraisonToDelete.length > 0) {
      this.updateQteStock(detLivraisonToDelete, OperationType.DELETE);
    }

    if(detLivraisonChanged && detLivraisonChanged.length > 0) {
      this.updateQteStock(detLivraisonChanged, OperationType.DELETE);
    }

    if(detLivraisonToModify && detLivraisonToModify.length > 0) {
      this.updateQteStock(detLivraisonToModify, OperationType.ADD);
    }
    
    if(detLivraisonToAdd && detLivraisonToAdd.length > 0) {
      this.updateQteStock(detLivraisonToAdd, OperationType.ADD);
    }
  }

  giveMeMntBlBenefice(facture: Facture, detLivraisons: DetFacture[], etablissement: Etablissement) {
    let mntp: number = 0;
    for (let detlivraison of detLivraisons) {
			let charge = (detlivraison.stock?.pattc || 0 * ((etablissement && etablissement.pourcentageLiv) ? etablissement.pourcentageLiv : 0)) / 100;
			mntp += detlivraison.montantProduit - (detlivraison.qteFacturer * (detlivraison.stock?.pattc || 0 + charge));
		}
    facture.mantantBFBenefice = mntp;
  }

  prepareLivraison() {
    this.giveMeMntBlBenefice(this.facture, this.listDetFacture, this.etablissement);
  }

  miseAjour() {
    this.submitted = true;
    let trvErreur: boolean = false;
    if(!trvErreur) {
      this.facture = this.mapFormGroupToObject(this.formGroup, this.facture);
      this.prepareLivraison();

      let factureRequest: FactureRequest = {
        facture: this.facture,
        detFactures: this.listDetFacture
      };
      
      if(this.facture.id) {
        this.factureService.update(this.facture.id, factureRequest).subscribe({
          next: (data: Facture) => {
            this.messageService.add({
              severity: 'success',
              summary: this.msg.summary.labelSuccess,
              detail: this.msg.messages.messageUpdateSuccess,
            });

            this.router.navigate(['/facture']);
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
        this.factureService.create(factureRequest).subscribe({
          next: (data: Facture) => {
            this.messageService.add({
              severity: 'success',
              summary: this.msg.summary.labelSuccess,
              detail: this.msg.messages.messageAddSuccess,
            });

            this.router.navigate(['/facture']);
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
      }
    }
  }

  fermer() {
    this.router.navigate(['/facture']);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}