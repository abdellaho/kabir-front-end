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
  //Tableau --> AchatBL ---> Date BL | Fournisseur | N BL Externe | Montant TTC | Actions
  // Ajouter --> Modal --> Date BL + Fournisseur + N BL Externe + Montant TTC + combo Produit + List Produits
  //Designation + Qte Stock + prix vente + qte + uniteGratuite + remise

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
      this.formGroup = this.formBuilder.group({
          dateOperation: [new Date(), [Validators.required]],
          stockId: [BigInt(0)],
          fournisseurId: [BigInt(0)],
          numBlExterne: [''],
          montant: [{ value: 0, disabled: true }],
          designation: [{ value: '', disabled: true }],
          qteStock: [{ value: 0, disabled: true }],
          qte: [1],
          prixVente: [0],
          remise: [0],
          uniteGratuite: [0],
      }, { validators: [AchatSimpleValidator({ getListDetAchatSimple: () => this.listDetAchatFacture })] });
  }

  search() {
      this.getAllStockDepot();
  }

  getAllStockDepot(): void {
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

  validerProduits() {
		boolean trvErreur = controleProduit();
		if (trvErreur == false) {
			int qteachet = 0;
			int Totqqte = 0;
			int ug = 0;

			if (this.detAchatFacture.qteacheter > 0) {
				qteachet = this.detAchatFacture.qteacheter;
			}
			if (this.detAchatFacture.unitegratuit > 0) {
				ug = this.detAchatFacture.unitegratuit;
			}

			this.listDetAchatFacture.push(this.detAchatFacture);
			this.idStock = 0;
			
			this.achatFacture.setMantantTotTTC(this.giveMeTotalMntTTc(this.listDetAchatFacture));
			this.achatFacture.setMantantTotHT(this.giveMeTotalMntHT(this.listDetAchatFacture));
			this.achatFacture.setTva20(this.giveMeTotalMntTVA20(this.listDetAchatFacture));
			this.achatFacture.setTva7(this.giveMeTotalMntTVA7(this.listDetAchatFacture));
			
			this.calculerMntTtc();
		}
	}

  afficherProduitsAchatFac() {
    if(this.formGroup.get('stockId')?.value > BigInt(0)) {
        initObjectStock();
        this.detAchatFacture = initObjectDetAchatFacture();
        
        let existe: boolean = this.listDetAchatFacture.find(e => e.stockId === this.formGroup.get('stockId')?.value);

        if (existe == false) {
            this.detAchatFacture.setRemiseAchat(0.0);
            this.detAchatFacture.setQteacheter(0);
            this.detAchatFacture.setUnitegratuit(0);
            this.detAchatFacture.setPrixAchatHt(stock.getPahtGrossiste());
            this.detAchatFacture.setPrixVenteAchatHT(stock.getPvaht());

            this.detAchatFacture.setPrixAchatTtc(stock.getPattc());
            this.detAchatFacture.setPrixVenteTtc(stock.getPvttc());
            this.detAchatFacture.setBenepourcentage(stock.getBenifice());

            this.detAchatFacture.setBeneficeDH(stock.getPvttc() - stock.getPattc());
            this.detAchatFacture.setBenepourcentage(stock.getBenifice());
            this.detAchatFacture.setStock(stock);
        }
    }
}

  viderAjouter() {
    initObjectsAjout();
    
    int num = 0;
    num = givemeMaxLiv();
    String codbl = num + "";
    String codeBLe = "";
    if (codbl.length() == 1) {
        codeBLe = "A000" + num;
    } else if (codbl.length() == 2) {
        codeBLe = "A00" + num;
    }
    if (codbl.length() >= 3) {
        codeBLe = "A0" + num;
    }
    
    this.achatFacture.setTypeReglment(1);
    this.achatFacture.setNumAchat(num);
    this.achatFacture.setCodeAF(codeBLe);
    this.achatFacture.setManuelAutoMatique(1);
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
          this.isValid = false;
          this.stock = initObjectStock();
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
            this.detAchatFacture.setRemiseAchat(0.0);
				this.detAchatFacture.setQteacheter(0);
				this.detAchatFacture.setUnitegratuit(0);
				this.detAchatFacture.setPrixAchatHt(stock.getPahtGrossiste());
				this.detAchatFacture.setPrixVenteAchatHT(stock.getPvaht());

				this.detAchatFacture.setPrixAchatTtc(stock.getPattc());
				this.detAchatFacture.setPrixVenteTtc(stock.getPvttc());
				this.detAchatFacture.setBenepourcentage(stock.getBenifice());

				this.detAchatFacture.setBeneficeDH(stock.getPvttc() - stock.getPattc());
				this.detAchatFacture.setStock(stock);

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
        let montant: number = 0;
        if(this.listDetAchatFacture && this.listDetAchatFacture.length > 0) {
            this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                montant += detAchatFacture.montant;
            });
        }

        this.formGroup.patchValue({
            montant,
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
        
        this.calculerMntTtc();
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

  viderAjouter() {
      this.openCloseDialogAjouter(true);
      this.submitted = false;
      this.listDetAchatFacture = [];
      this.achatFacture = initObjectAchatFacture();
      this.initFormGroup();
  }

  getDesignation(id: number): string {
      return getElementFromMap(this.mapOfStock, id);
  }

  getDesignationFournisseur(id: number): string {
      return getElementFromMap(this.mapOfFournisseur, id);
  }

  recupperer(operation: number, achatSimpleEdit: AchatFacture) {
      if (achatSimpleEdit && achatSimpleEdit.id) {
          if (operation === 1) {
              this.achatFactureService.getByIdRequest(achatSimpleEdit.id).subscribe({
                  next: (data: AchatFactureRequest) => {
                      this.achatFacture = data.achatFacture;
                      this.listDetAchatFacture = data.detAchatFactures;

                      this.listDetAchatFacture.forEach((detAchatFacture: DetAchatFacture) => {
                          if(detAchatFacture.stockId && detAchatFacture.stockId !== BigInt(0)) {
                              let stock: Stock = this.listStock.find((stock: Stock) => stock.id === detAchatFacture.stockId) || initObjectStock();
                              detAchatFacture.stock = stock;
                          }
                      });
                      
                      this.formGroup.patchValue({
                          uniteGratuite: 0,
                          qteStock: 0,
                          prixVente: 0,
                          remise: 0,
                          designation: '',
                          stockId: BigInt(0),
                          qte: 1,
                          dateOperation: new Date(this.achatFacture.dateOperation),
                          fournisseurId: this.achatFacture.fournisseurId,
                          numBlExterne: this.achatFacture.numBlExterne,
                          montant: this.achatFacture.montant,
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
              this.achatFacture = structuredClone(achatSimpleEdit);
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
