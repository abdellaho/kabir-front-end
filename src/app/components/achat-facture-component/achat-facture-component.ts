import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { initObjectStock, Stock } from '@/models/stock';
import { DetAchatFacture, initObjectDetAchatFacture } from '@/models/det-achat-facture';
import { AchatFacture, initObjectAchatFacture } from '@/models/achat-facture';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { TypeSearch } from '@/shared/enums/type-search';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { AchatFactureRequest } from '@/shared/classes/achat-facture-request';
import { AchatFactureService } from '@/services/achat-facture/achat-facture-service';
import { StockService } from '@/services/stock/stock-service';
import { MessageService } from 'primeng/api';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { LoadingService } from '@/shared/services/loading-service';
import { OperationType } from '@/shared/enums/operation-type';
import { AchatFactureValidator } from '@/validators/achat-facture-validator';

@Component({
  selector: 'app-achat-facture-component',
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
    SelectModule,
    DatePickerModule,
    MessageModule,
    InputTextModule
  ],
  templateUrl: './achat-facture-component.html',
  styleUrl: './achat-facture-component.scss'
})
export class AchatFactureComponent {
  
  //Achat/BL
  //Buttons : Ajouter, Rechercher, Actualiser, Consulter
  //Tableau --> Fournisseur ---> Date | ICE | Date paiement |Paiement Type | Cheque N | N° Fature |  MT TTC | Actions
  //Ajouter --> Modal --> Fournisseur + ICE + N° Facture + Date Facture + Date Paiement + Paiement Type + Cheque N 
  // || TVA7 Manuelle + TVA10 Manuelle + TVA12 Manuelle + TVA14 Manuelle + TVA20 Manuelle +  HT 
  // || HT7 + HT10 + HT12 + HT14 + HT20 + HT + Total HT
  // || TVA7 + TVA10 + TVA12 + TVA14 + TVA20 + TVA + Total TVA
  // || TTC7 + TTC10 + TTC12 + TTC14 + TTC20 + Total TTC
  // Total MT Produit
  // || combo Produit + List Produits
  //Designation + St Facturé (qte facturé) + qte Acheté + uniteGratuite + Mt Produit + Action (delete)

  isValid: boolean = false;
  listStock: Stock[] = [];
  listAchatFacture: AchatFacture[] = [];
  listDetAchatFacture: DetAchatFacture[] = [];
  listFournisseur: Fournisseur[] = [];
  achatFacture: AchatFacture = initObjectAchatFacture();
  selectedAchatFacture!: AchatFacture;
  detAchatFacture: DetAchatFacture = initObjectDetAchatFacture();
  stock: Stock = initObjectStock();
  mapOfStock: Map<number, string> = new Map<number, string>();
  mapOfFournisseur: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogSupprimerDetAchatFacture: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;
  msg = APP_MESSAGES;
  readonly BigInt = BigInt; // Expose BigInt to template

  constructor(
      private achatFactureService: AchatFactureService,
      private stockService: StockService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private fournisseurService: FournisseurService,
      private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
      this.search();
      this.getAllStock();
      this.getAllFournisseur();
      this.initFormGroup();
  }

  clear(table: Table) {
      table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  initFormGroup() {
    /*
    Fournisseur + ICE + N° Facture + Date Facture + Date Paiement + Paiement Type + Cheque N 
  // || TVA7 Manuelle + TVA10 Manuelle + TVA12 Manuelle + TVA14 Manuelle + TVA20 Manuelle +  HT 
  // || HT7 + HT10 + HT12 + HT14 + HT20 + HT + Total HT
  // || TVA7 + TVA10 + TVA12 + TVA14 + TVA20 + TVA + Total TVA
  // || TTC7 + TTC10 + TTC12 + TTC14 + TTC20 + Total TTC
  // Total MT Produit
    */
      this.formGroup = this.formBuilder.group({
          fournisseurId: [BigInt(0), [Validators.required, Validators.min(1)]],
          ice: [''],
          numFacture: [''],
          dateFacture: [new Date(), [Validators.required]],
          datePaiement: [new Date(), [Validators.required]],
          typePaiement: [0, [Validators.required]],
          chequeNum: [''],
          tva7Manuelle: [0],
          tva10Manuelle: [0],
          tva12Manuelle: [0],
          tva14Manuelle: [0],
          tva20Manuelle: [0],
          ht7: [0],
          ht10: [0],
          ht12: [0],
          ht14: [0],
          ht20: [0],
          ht: [0],
          totalHt: [0],
          tva7: [0],
          tva10: [0],
          tva12: [0],
          tva14: [0],
          tva20: [0],
          tva: [0],
          totalTva: [0],
          ttc7: [0],
          ttc10: [0],
          ttc12: [0],
          ttc14: [0],
          ttc20: [0],
          totalTtc: [0],
          totalMtProduit: [0],
      }, { validators: [AchatFactureValidator()] });
  }

  search() {
      this.getAllAchatFacture();
  }

  getAllAchatFacture(): void {
      this.listAchatFacture = [];
      this.achatFactureService.getAll().subscribe({
          next: (data: AchatFacture[]) => {
              this.listAchatFacture = data;
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  getAllFournisseur(): void {
      this.listFournisseur = [];
      let fournisseurSearch: Fournisseur = initObjectSearch(false, false, TypeSearch.Fournisseur);

      this.fournisseurService.search(fournisseurSearch).subscribe({
          next: (data: Fournisseur[]) => {
              let initFournisseur: Fournisseur = initObjectFournisseur();
              initFournisseur.id = BigInt(0);
              this.listFournisseur = [initFournisseur, ...data];
              this.mapOfFournisseur = arrayToMap(this.listFournisseur, 'id', ['designation'], ['']);
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  getAllStock(): void {
      this.listStock = [];
      let stockSearch: Stock = initObjectSearch(false, false, TypeSearch.Stock);

      this.stockService.search(stockSearch).subscribe({
          next: (data: Stock[]) => {
              let initStock: Stock = initObjectStock();
              initStock.id = BigInt(0);
              this.listStock = [initStock, ...data];
              this.mapOfStock = arrayToMap(this.listStock, 'id', ['designation'], ['']);
          }, error: (error: any) => {
              console.error(error);
          }, complete: () => {
              this.loadingService.hide();
          }
      });
  }

  afficherProduitsAchatFac() {
    if(this.formGroup.get('stockId')?.value > BigInt(0)) {
        let stock: Stock = this.listStock.find(e => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();;
        this.detAchatFacture = initObjectDetAchatFacture();
        
        let existe: boolean = this.listDetAchatFacture.some(e => e.stockId === this.formGroup.get('stockId')?.value);

        if (existe == false) {
            this.detAchatFacture.remiseAchat = 0;
            this.detAchatFacture.qteacheter = 0;
            this.detAchatFacture.unitegratuit = 0;
            this.detAchatFacture.prixAchatHt = stock?.pahtGrossiste;
            this.detAchatFacture.prixVenteAchatHT = stock?.pvaht;

            this.detAchatFacture.prixAchatTtc = stock?.pattc;
            this.detAchatFacture.prixVenteTtc = stock?.pvttc;
            this.detAchatFacture.benepourcentage = stock?.benifice;

            this.detAchatFacture.beneficeDH = stock?.pvttc - stock?.pattc;
            this.detAchatFacture.benepourcentage = stock?.benifice;
            this.detAchatFacture.stock = stock;
        }
    }
}
	
	/*public void miseAjour() {
		boolean trvErreur = controle();
		if(trvErreur == false) {
			Repertoire repertoireFour = new Repertoire();
			repertoireFour.setId(idRepertoireFournisseur);
			this.achatFacture.setRepertoire(repertoireFour);
			
			if(null != this.achatFacture.getId() && this.achatFacture.getId() != 0) {
				//this.achatFacture.setMantantTotHTVA(this.achatFacture.getTvaArbtraire());
				this.achatFacture.setTvaArbtraire(this.achatFacture.getMantantTotHTVA());
				achatfactureService.modifier(this.achatFacture);
				
				supprimerListeDetAchatFact(this.achatFacture.getId());
				ajouterDetAchatLivr(this.listDetAchatFacture, this.achatFacture);
				
				PrimeFaces.current().executeScript("PF('dialogAjouter').hide();");
			}else {
				//this.achatFacture.setMantantTotHTVA(this.achatFacture.getTvaArbtraire());
				this.achatFacture.setTvaArbtraire(this.achatFacture.getMantantTotHTVA());
				this.achatFacture.setSysDate(new Date());
				this.achatFacture.setEmployeOperateur(utilisateurConnecte);
				
				achatfactureService.ajouter(this.achatFacture);
				ajouterDetAchatLivr(this.listDetAchatFacture, this.achatFacture);
			}
			
			initListDetachatfacture();
			initListDetachatfactureAncien();
			initObjectsAjout();
			rechercher();
		}
	}*/

  onChangeIdStock() {
      if(this.formGroup.get('stockId')?.value > BigInt(0)) {
        let stock: Stock = this.listStock.find(e => e.id === this.formGroup.get('stockId')?.value) || initObjectStock();
          this.isValid = false;
          let isExistStock: boolean = false;

          this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
              if(detAchatFacture.stockId === this.formGroup.get('stockId')?.value) {
                  isExistStock = true;

                  this.formGroup.patchValue({
                      stockId: BigInt(0),
                  });

                  return;
              }
          });
      
          if(!isExistStock) {
            this.detAchatFacture.remiseAchat = 0.0;
				this.detAchatFacture.qteacheter = 0;
				this.detAchatFacture.unitegratuit = 0;
				this.detAchatFacture.prixAchatHt = stock.pahtGrossiste;
				this.detAchatFacture.prixVenteAchatHT = stock.pvaht;

				this.detAchatFacture.prixAchatTtc = stock.pattc;
				this.detAchatFacture.prixVenteTtc = stock.pvttc;
				this.detAchatFacture.benepourcentage = stock.benifice;

				this.detAchatFacture.beneficeDH = stock.pvttc - stock.pattc;
				this.detAchatFacture.stock = stock;

              this.stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
              this.formGroup.patchValue({
                  uniteGratuite: 0,
                  qteStock: this.stock.qteStock,
                  prixVente: this.stock.pvttc,
                  remise: 0,
                  qte: 1,
                  designation: this.stock.designation,
              });

              this.formGroup.get('designation')?.disable();
              this.formGroup.get('qteStock')?.disable();
              this.isValid = true;
          }
      }
  }

  initDetAchatSimpleFormInformation() {
      this.stock = initObjectStock();
      this.formGroup.patchValue({
          stockId: BigInt(0),
          prixVente: 0,
          qteStock: 0,
          remise: 0,
          uniteGratuite: 0,
          qte: 1,
          designation: '',
      });
      this.formGroup.get('designation')?.disable();
      this.formGroup.get('qteStock')?.disable();
  }

  recuppererDetAchatSimple(operation: number, detAchatSimpleEdit: DetAchatFacture) {
      if (detAchatSimpleEdit && detAchatSimpleEdit.stockId) {
          this.detAchatFacture = structuredClone(detAchatSimpleEdit);
          if (operation === 1) {
              this.openCloseDialogAjouter(true);
          } else if (operation === 2) {
              this.openCloseDialogSupprimerDetAchatFacture(true);
          }
      }
  }

  calculerTotal() {
        let mantantTTC: number = 0;
        if(this.listDetAchatFacture && this.listDetAchatFacture.length > 0) {
            this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                mantantTTC += detAchatFacture.mantantTTC;
            });
        }

        this.formGroup.patchValue({
            mantantTTC,
        });
  }

    validerProduits() {
        let qteachet: number = 0;
        let Totqqte: number = 0;
        let ug: number = 0;

        if (this.detAchatFacture.qteacheter > 0) {
            qteachet = this.detAchatFacture.qteacheter;
        }
        if (this.detAchatFacture.unitegratuit > 0) {
            ug = this.detAchatFacture.unitegratuit;
        }

        this.listDetAchatFacture.push(this.detAchatFacture);
        
        this.achatFacture.mantantTotTTC = this.giveMeTotalMntTTc(this.listDetAchatFacture);
        this.achatFacture.mantantTotHT = this.giveMeTotalMntHT(this.listDetAchatFacture);
        this.achatFacture.tva20 = this.giveMeTotalMntTVA20(this.listDetAchatFacture);
        this.achatFacture.tva7 = this.giveMeTotalMntTVA7(this.listDetAchatFacture);
        
        //this.calculerMntTtc();
    }

  calculerMontProd() {
		if (this.detAchatFacture != null) {
			let prv = 0.0;
			let prattc = 0.0;
			let qteLivr = 0;
			let rmiseLivr = 0.0;
			let mntPro = 0.0;
			
			if (this.detAchatFacture.prixVenteTtc > 0.0) {
				prv = this.detAchatFacture.prixVenteTtc;
			}
			if (this.detAchatFacture.prixAchatTtc > 0.0) {
				prattc = this.detAchatFacture.prixAchatTtc;
			}
			if (this.detAchatFacture.qteacheter > 0) {
				qteLivr = this.detAchatFacture.qteacheter;
			}
			if (this.detAchatFacture.remiseAchat > 0) {
				rmiseLivr = this.detAchatFacture.remiseAchat;
			}

			if (this.detAchatFacture.remiseAchat == 0.0 && this.detAchatFacture.unitegratuit == 0) {
				mntPro = (prattc * qteLivr) - (((prattc * qteLivr) * rmiseLivr) / 100);
			} else {
				mntPro = (prv * qteLivr) - (((prv * qteLivr) * rmiseLivr) / 100);
			}

			this.detAchatFacture.mantantTTC = mntPro;
			if (this.detAchatFacture.stock?.tva == 7) {
				let tv7 = 1.07;
				let prhht = this.detAchatFacture.mantantTTC / tv7;
				this.detAchatFacture.mantantHt = prhht;
				this.detAchatFacture.tva7 = this.detAchatFacture.mantantTTC - this.detAchatFacture.mantantHt;

				this.detAchatFacture.tva20 = 0.0;
			} else {
				let tv7 = 1.2;
				let prhht = this.detAchatFacture.mantantTTC / tv7;
				this.detAchatFacture.mantantHt = prhht;
				this.detAchatFacture.tva20 = this.detAchatFacture.mantantTTC - this.detAchatFacture.mantantHt;

				this.detAchatFacture.tva7 = 0.0;
			}
		}
	}
	
	calculerDroitSuuplemntaire() {
		if (this.achatFacture.id) {
			let MNTTCCC = 0.0;
			let supAncien = 0.0;
			let acht = this.achatFactureService.findById(this.achatFacture.id);
			MNTTCCC = acht.getMantantTotTTC();
			if (acht.getMontantDroitSupplementaire() != 0) {
				supAncien = acht.getMontantDroitSupplementaire();
			}
			if (this.achatFacture != null && this.achatFacture.montantDroitSupplementaire != 0) {
				if (this.achatFacture.montantDroitSupplementaire - supAncien == 0) {
					if (this.achatFacture.mantantTotTTC == 0) {
						this.achatFacture.mantantTotTTC = this.achatFacture.montantDroitSupplementaire;
					} else {
						this.achatFacture.mantantTotTTC = acht.getMantantTotTTC();
					}
				} else {
					let mnttvvaa = 0.0;
					if (this.achatFacture.montantTVA7 != 0) {
						mnttvvaa += this.achatFacture.montantTVA7;
					}
					if (this.achatFacture.montantTVA10 != 0) {
						mnttvvaa += this.achatFacture.montantTVA10;
					}
					if (this.achatFacture.montantTVA14 != 0) {
						mnttvvaa += this.achatFacture.montantTVA14;
					}
					if (this.achatFacture.montantTVA20 != 0) {
						mnttvvaa += this.achatFacture.montantTVA20;
					}
					let droSup = this.achatFacture.montantDroitSupplementaire;
					
					this.achatFacture.tvaArbtraire = mnttvvaa;
					this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + mnttvvaa + droSup;
				}
			} else {
				this.achatFacture.mantantTotTTC = MNTTCCC - supAncien;
				if (this.achatFacture.montantTVA7 != 0) {
					this.calculerTva7();
				} else if (this.achatFacture.montantTVA10 != 0) {
					this.calculerTva10();
				} else if (this.achatFacture.montantTVA14 != 0) {
					this.calculerTva14();
				} else if (this.achatFacture.montantTVA20 != 0) {
					this.calculerTva20();
				} else {
					this.calculerAllTva();
				}
			}
		} else {
			if (this.achatFacture != null && this.achatFacture.montantDroitSupplementaire != 0) {
				this.calculerAllTva();
			} else {
				if (this.achatFacture.montantTVA7 != 0) {
					this.calculerTva7();
				} else if (this.achatFacture.montantTVA10 != 0) {
					this.calculerTva10();
				} else if (this.achatFacture.montantTVA14 != 0) {
					this.calculerTva14();
				} else if (this.achatFacture.montantTVA20 != 0) {
					this.calculerTva20();
				} else {
					this.calculerAllTva();
				}
			}
		}
	}

	calculerTva7() {
		if (this.achatFacture != null) {
			if (this.achatFacture.montantTVA20 != 0 || this.achatFacture.montantTVA14 != 0 || this.achatFacture.montantTVA10 != 0) {
				this.calculerAllTva();
			} else {
				let drSup = this.achatFacture.montantDroitSupplementaire;
				
				this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + this.achatFacture.montantTVA7 + drSup;
				this.achatFacture.tvaArbtraire = this.achatFacture.montantTVA7;
			}
		}
	}

	calculerTva20() {
		if (this.achatFacture != null) {
			if (this.achatFacture.montantTVA7 != 0 || this.achatFacture.montantTVA14 != 0 || this.achatFacture.montantTVA10 != 0) {
				this.calculerAllTva();
			} else {
				let drSup = this.achatFacture.montantDroitSupplementaire;
				
				this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + this.achatFacture.montantTVA20 + drSup;
				this.achatFacture.tvaArbtraire = this.achatFacture.montantTVA20;
			}
		}
	}

	calculerTva10() {
		if (this.achatFacture != null) {
			if (this.achatFacture.montantTVA7 != 0 || this.achatFacture.montantTVA20 != 0 || this.achatFacture.montantTVA14 != 0) {
				this.calculerAllTva();
			} else {
				let drSup = this.achatFacture.montantDroitSupplementaire;
				
				this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + this.achatFacture.montantTVA10 + drSup;
				this.achatFacture.tvaArbtraire = this.achatFacture.montantTVA10;
			}
		}
	}

	calculerTva14() {
		if (this.achatFacture != null) {
			if (this.achatFacture.montantTVA7 != 0 || this.achatFacture.montantTVA20 != 0 || this.achatFacture.montantTVA10 != 0) {
				this.calculerAllTva();
			} else {
				let drSup = this.achatFacture.montantDroitSupplementaire;
				
				this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + this.achatFacture.montantTVA14 + drSup;
				this.achatFacture.tvaArbtraire = this.achatFacture.montantTVA14;
			}
		}
	}

	calculerAllTva() {
		if (this.achatFacture != null && this.achatFacture.mantantTotHT != 0) {
			let mnttvvaa = 0.0;
			if (this.achatFacture.montantTVA7 != 0) {
				mnttvvaa += this.achatFacture.montantTVA7;
			}
			if (this.achatFacture.montantTVA10 != 0) {
				mnttvvaa += this.achatFacture.montantTVA10;
			}
			if (this.achatFacture.montantTVA14 != 0) {
				mnttvvaa += this.achatFacture.montantTVA14;
			}
			if (this.achatFacture.montantTVA20 != 0) {
				mnttvvaa += this.achatFacture.montantTVA20;
			}
			let droSup = this.achatFacture.montantDroitSupplementaire;
			this.achatFacture.tvaArbtraire = mnttvvaa;
			this.achatFacture.mantantTotTTC = this.achatFacture.mantantTotHT + mnttvvaa + droSup;
		}
	}

  private giveMeTotalMntHT(listDetachatfacture2: DetAchatFacture[]) {
		let mntp = 0.0;
		for (let detachatfactures of listDetachatfacture2) {
			mntp += detachatfactures.mantantHt;
		}
		return mntp;
	}

	private giveMeTotalMntTTc(listDetachatfacture2: DetAchatFacture[]) {
		let mntp = 0.0;
		for (let detachatfactures of listDetachatfacture2) {
			mntp += detachatfactures.mantantTTC;
		}
		return mntp;
	}
	
	private giveMeTotalMntTVA7(listDetachatfacture2: DetAchatFacture[]) {
		let mntp = 0.0;
		for (let detachatfactures of listDetachatfacture2) {
			mntp += detachatfactures.tva7;
		}
		return mntp;
	}

	private giveMeTotalMntTVA20(listDetachatfacture2: DetAchatFacture[]) {
		let mntp = 0.0;
		for (let detachatfactures of listDetachatfacture2) {
			mntp += detachatfactures.tva20;
		}
		return mntp;
	}

  validerDetAchatFacture() {
      if(this.formGroup.get('stockId')?.value > BigInt(0) && this.formGroup.get('qte')?.value > 0) {
          let detAchatFacture: DetAchatFacture = initObjectDetAchatFacture();
          detAchatFacture.stockId = this.formGroup.get('stockId')?.value;
          detAchatFacture.qteacheter = this.formGroup.get('qte')?.value;
          detAchatFacture.remiseAchat = this.formGroup.get('remiseAchat')?.value;
          detAchatFacture.unitegratuit = this.formGroup.get('unitegratuit')?.value;
          
          let stock: Stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
          detAchatFacture.stock = stock;

          this.listDetAchatFacture.push(detAchatFacture);
          
          this.initDetAchatSimpleFormInformation();
          this.calculerTotal();
      }
  }

  supprimerDetAchatFacture() {
      this.listDetAchatFacture = this.listDetAchatFacture.filter((detAchatFacture: DetAchatFacture) => detAchatFacture.stockId !== this.detAchatFacture.stockId);
      this.calculerTotal();
      this.formGroup.updateValueAndValidity();
      this.openCloseDialogSupprimerDetAchatFacture(false);
  }

  openCloseDialogAjouter(openClose: boolean): void {
      this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
      this.dialogSupprimer = openClose;
  }

  openCloseDialogSupprimerDetAchatFacture(openClose: boolean): void {
      this.dialogSupprimerDetAchatFacture = openClose;
  }

  async getLastNumAchatFacture(): Promise<number> {
    let numAchat: number = 0;

    this.achatFactureService.getLastNumAchat(this.achatFacture).subscribe({
        next: (data: number) => {
            numAchat = data;
        }
    });
    
    return numAchat;
  }

  generateNumAchat(achatFacture: AchatFacture): string {
        let codbl = achatFacture.numAchat + "";
        let codeBLe = "";
        if (codbl.length == 1) {
            codeBLe = "A000" + achatFacture.numAchat;
        } else if (codbl.length == 2) {
            codeBLe = "A00" + achatFacture.numAchat;
        }
        if (codbl.length >= 3) {
            codeBLe = "A0" + achatFacture.numAchat;
        }

        return codeBLe;
  }

  async viderAjouter() {
      this.openCloseDialogAjouter(true);
      this.submitted = false;
      this.listDetAchatFacture = [];
      this.achatFacture = initObjectAchatFacture();
      let numAchat: number = await this.getLastNumAchatFacture();
      this.achatFacture.numAchat = numAchat;
      this.achatFacture.codeAF = this.generateNumAchat(this.achatFacture);
      this.initFormGroup();
  }

  getDesignation(id: number): string {
      return getElementFromMap(this.mapOfStock, id);
  }

  getDesignationFournisseur(id: number): string {
      return getElementFromMap(this.mapOfFournisseur, id);
  }

  recupperer(operation: number, achatFactureEdit: AchatFacture) {
      if (achatFactureEdit && achatFactureEdit.id) {
          if (operation === 1) {
              this.achatFactureService.getByIdRequest(achatFactureEdit.id).subscribe({
                  next: (data: AchatFactureRequest) => {
                      this.achatFacture = data.achatFacture;
                      this.listDetAchatFacture = data.detAchatFactures;

                      this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                          if(detAchatFacture.stockId && detAchatFacture.stockId !== BigInt(0)) {
                              let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detAchatFacture.stockId) || initObjectStock();
                              detAchatFacture.stock = stock;
                          }
                      });

                      let fournisseur: Fournisseur = this.listFournisseur.find((fournisseur: Fournisseur) => fournisseur.id === this.achatFacture.fournisseurId) || initObjectFournisseur();

                      /*
                      fournisseurId: [BigInt(0), [Validators.required, Validators.min(1)]],
          ice: [''],
          numFacture: [''],
          dateFacture: [new Date(), [Validators.required]],
          datePaiement: [new Date(), [Validators.required]],
          typePaiement: [0, [Validators.required]],
          chequeNum: [''],
          tva7Manuelle: [0],
          tva10Manuelle: [0],
          tva12Manuelle: [0],
          tva14Manuelle: [0],
          tva20Manuelle: [0],
          ht7: [0],
          ht10: [0],
          ht12: [0],
          ht14: [0],
          ht20: [0],
          ht: [0],
          totalHt: [0],
          tva7: [0],
          tva10: [0],
          tva12: [0],
          tva14: [0],
          tva20: [0],
          tva: [0],
          totalTva: [0],
          ttc7: [0],
          ttc10: [0],
          ttc12: [0],
          ttc14: [0],
          ttc20: [0],
          totalTtc: [0],
          totalMtProduit: [0],
                      */
                      
                      this.formGroup.patchValue({
                          fournisseurId: this.achatFacture.fournisseurId,
                          ice: fournisseur.ice,
                          numFacture: this.achatFacture.numAchat,
                          dateFacture: this.achatFacture.dateAF,
                          datePaiement: this.achatFacture.dateReglement,
                          typePaiement: this.achatFacture.typeReglment,
                          chequeNum: this.achatFacture.numCheque,
                          tva7Manuelle: this.achatFacture.mntManuelTva7,
                          tva10Manuelle: this.achatFacture.mntManuelTva10,
                          tva12Manuelle: this.achatFacture.mntManuelTva12,
                          tva14Manuelle: this.achatFacture.mntManuelTva14,
                          tva20Manuelle: this.achatFacture.mntManuelTva20,
                          ht7: this.achatFacture.mntHtTVA7,
                          ht10: this.achatFacture.mntHtTVA10,
                          ht12: this.achatFacture.mntHtTVA12,
                          ht14: this.achatFacture.mntHtTVA14,
                          ht20: this.achatFacture.mntHtTVA20,
                          ht: this.achatFacture.mntHt,
                          totalHt: this.achatFacture.mntHtTVA,
                          tva7: this.achatFacture.montantTVA7,
                          tva10: this.achatFacture.montantTVA10,
                          tva12: this.achatFacture.montantTVA12,
                          tva14: this.achatFacture.montantTVA14,
                          tva20: this.achatFacture.montantTVA20,
                          tva: this.achatFacture.tva,
                          totalTva: this.achatFacture.montantTVA,
                          ttc7: this.achatFacture.mntTtcTVA7,
                          ttc10: this.achatFacture.mntTtcTVA10,
                          ttc12: this.achatFacture.mntTtcTVA12,
                          ttc14: this.achatFacture.mntTtcTVA14,
                          ttc20: this.achatFacture.mntTtcTVA20,
                          totalTtc: this.achatFacture.mntTtc,
                          totalMtProduit: this.achatFacture.totalMtProduit,
                      });

                      this.formGroup.get('designation')?.disable();
                      this.formGroup.get('qteStock')?.disable();
                      this.formGroup.updateValueAndValidity();

                      this.openCloseDialogAjouter(true);
                  }, error: (error: any) => {
                      console.error(error);
                  }, complete: () => {
                      this.loadingService.hide();
                  }
              });
          } else if (operation === 2) {
              this.achatFacture = structuredClone(achatFactureEdit);
              this.openCloseDialogSupprimer(true);
          }
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
      }
  }

  updateList(achatFacture: AchatFacture, list: AchatFacture[], operationType: OperationType, id?: bigint): AchatFacture[] {
      if (operationType === OperationType.ADD) {
          list = [...list, achatFacture];
      } else if (operationType === OperationType.MODIFY) {
          let index = list.findIndex(x => x.id === achatFacture.id);
          if (index > -1) {
              list[index] = achatFacture;
          }
      } else if (operationType === OperationType.DELETE) {
          list = list.filter(x => x.id !== id);
      }
      return list;
  }

  checkIfListIsNull() {
      if (null == this.listAchatFacture) {
          this.listAchatFacture = [];
      }
  }

  mapFormGroupToObject(formGroup: FormGroup, achatFacture: AchatFacture): AchatFacture {
      achatFacture.dateOperation = mapToDateTimeBackEnd(formGroup.get('dateOperation')?.value);
      achatFacture.fournisseurId = formGroup.get('fournisseurId')?.value;
      achatFacture.numBlExterne = formGroup.get('numBlExterne')?.value;
      achatFacture.montant = formGroup.get('montant')?.value || 0;

      return achatFacture;
  }

  async miseAjour(): Promise<void> {
      this.submitted = true;
      this.loadingService.show();
      let stockDepotEdit: AchatFacture = { ...this.achatFacture };
      this.mapFormGroupToObject(this.formGroup, stockDepotEdit);
      let trvErreur = false;// await this.checkIfExists(stockDepotEdit);

      if (!trvErreur) {
          this.achatFacture = this.mapFormGroupToObject(this.formGroup, this.achatFacture);

          let achatFactureRequest: AchatFactureRequest = { achatFacture: {...this.achatFacture }, detAchatFactures: this.listDetAchatFacture };

          if (this.achatFacture.id) {
              this.achatFactureService.update(this.achatFacture.id, achatFactureRequest).subscribe({
                  next: (data) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageUpdateSuccess
                      });

                      this.listDetAchatFacture = [];
                      this.checkIfListIsNull();
                      this.listAchatFacture = this.updateList(data, this.listAchatFacture, OperationType.MODIFY);
                      this.openCloseDialogAjouter(false);
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
              this.achatFactureService.create(achatFactureRequest).subscribe({
                  next: (data: AchatFacture) => {
                      this.messageService.add({
                          severity: 'success',
                          summary: this.msg.summary.labelSuccess,
                          closable: true,
                          detail: this.msg.messages.messageAddSuccess
                      });

                      this.listDetAchatFacture = [];
                      this.checkIfListIsNull();
                      this.listAchatFacture = this.updateList(data, this.listAchatFacture, OperationType.ADD);
                      this.openCloseDialogAjouter(false);
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
      } else {
          this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.stock.label} ${this.msg.messages.messageExistDeja}` });
          this.loadingService.hide();
      }
  }

  supprimer(): void {
      if (this.achatFacture && this.achatFacture.id) {
          this.loadingService.show();
          let id = this.achatFacture.id;
          this.achatFactureService.delete(this.achatFacture.id).subscribe({
              next: (data) => {
                  this.messageService.add({
                      severity: 'success',
                      summary: this.msg.summary.labelSuccess,
                      closable: true,
                      detail: this.msg.messages.messageDeleteSuccess
                  });

                  this.checkIfListIsNull();
                  this.listAchatFacture = this.updateList(initObjectAchatFacture(), this.listAchatFacture, OperationType.DELETE, id);
                  this.achatFacture = initObjectAchatFacture();
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
