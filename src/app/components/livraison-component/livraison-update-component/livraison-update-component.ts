import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@/shared/services/data-service';
import { Router } from '@angular/router';
import { initObjectLivraison, Livraison } from '@/models/livraison';
import { Fournisseur } from '@/models/fournisseur';
import { DetLivraison } from '@/models/det-livraison';
import { Subscription } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { LivraisonService } from '@/services/livraison/livraison-service';
import { DetLivraisonService } from '@/services/det-livraison/det-livraison-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initObjectStock, Stock } from '@/models/stock';
import { StockService } from '@/services/stock/stock-service';

@Component({
  selector: 'app-livraison-update-component',
  imports: [],
  templateUrl: './livraison-update-component.html',
  styleUrl: './livraison-update-component.scss'
})
export class LivraisonUpdateComponent implements OnInit, OnDestroy {

  livraison: Livraison = initObjectLivraison();
  listFournisseur: Fournisseur[] = [];
  listDetLivraison: DetLivraison[] = [];
  listStock: Stock[] = [];
  subscription!: Subscription;
  msg = APP_MESSAGES;
  formGroup!: FormGroup;

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
    this.getAllStock();
    
    this.subscription = this.dataService.livraisonData$.subscribe({
      next: (data) => {
        this.livraison = data.livraison;
        this.listDetLivraison = data.detLivraisons;
        this.listFournisseur = data.listFournisseur;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initStockSearch(archiver: boolean, supprimer: boolean): Stock {
      let stockSearch: Stock = initObjectStock();

      stockSearch.archiver = archiver;
      stockSearch.supprimer = supprimer;

      return stockSearch;
  }

  getAllStock(): void {
      let stockSearch: Stock = this.initStockSearch(false, false);
      this.stockService.search(stockSearch).subscribe({
          next: (data: Stock[]) => {
              this.listStock = data;
          }, error: (error: any) => {
              console.error(error);
          }
      });
  }

  initFormGroup() {
      this.formGroup = this.formBuilder.group({
        numLivraison: [0],
        codeBl: [''],
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
        mantantBLReel: [0],
        mantantBLBenefice: [0],
        typePaiement: [''],
        mantantBLPourcent: [0],
        reglerNonRegler: [0],
        sysDate: [new Date()],
        infinity: [0],
        etatBultinPaie: [0],
        livrernonlivrer: [0],
        avecRemise: [false],
        mntReglement: [0],
        mntReglement2: [0],
        mntReglement3: [0],
        mntReglement4: [0],
        facturer100: [false],
        codeTransport: [''],
        personnelId: [0],
        personnelAncienId: [null],
        fournisseurId: [0],
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
    this.livraison.mantantBLReel = this.formGroup.get('mantantBLReel')?.value;
    this.livraison.mantantBLBenefice = this.formGroup.get('mantantBLBenefice')?.value;
    this.livraison.typePaiement = this.formGroup.get('typePaiement')?.value;
    this.livraison.mantantBLPourcent = this.formGroup.get('mantantBLPourcent')?.value;
    this.livraison.reglerNonRegler = this.formGroup.get('reglerNonRegler')?.value;
    this.livraison.infinity = this.formGroup.get('infinity')?.value;
    this.livraison.etatBultinPaie = this.formGroup.get('etatBultinPaie')?.value;
    this.livraison.livrernonlivrer = this.formGroup.get('livrernonlivrer')?.value;
    this.livraison.avecRemise = this.formGroup.get('avecRemise')?.value;
    this.livraison.mntReglement = this.formGroup.get('mntReglement')?.value;
    this.livraison.mntReglement2 = this.formGroup.get('mntReglement2')?.value;
    this.livraison.mntReglement3 = this.formGroup.get('mntReglement3')?.value;
    this.livraison.mntReglement4 = this.formGroup.get('mntReglement4')?.value;
    this.livraison.facturer100 = this.formGroup.get('facturer100')?.value;
    this.livraison.codeTransport = this.formGroup.get('codeTransport')?.value;
    this.livraison.personnelId = this.formGroup.get('personnelId')?.value;
    this.livraison.personnelAncienId = this.formGroup.get('personnelAncienId')?.value;
    this.livraison.fournisseurId = this.formGroup.get('fournisseurId')?.value;
  }


  miseAjour() {
    
    
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
