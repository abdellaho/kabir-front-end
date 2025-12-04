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
          designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          type: [null],
          tel1: [''],
          tel2: [''],
          ice: ['', [Validators.maxLength(15)]],
          adresse: [''],
      });
  }

  miseAjour() {
    
    
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
