import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
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
  dialogSupprimerDetAchatSimple: boolean = false;
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

  public void validerProduits() {
		boolean trvErreur = controleProduit();
		if (trvErreur == false) {
			int qteachet = 0;
			int Totqqte = 0;
			int ug = 0;

			if (detachatfacture.getQteacheter() > 0) {
				qteachet = detachatfacture.getQteacheter();
			}
			if (detachatfacture.getUnitegratuit() > 0) {
				ug = detachatfacture.getUnitegratuit();
			}
			Stock stockMod = stockService.findById(stock.getId());
			Totqqte = stockMod.getQteFacturer() + (qteachet + ug);
			stockMod.setQteFacturer(Totqqte);
			detachatfacture.setStock(stockMod);

			listDetachatfacture.add(detachatfacture);
			idStock = 0;
			
			achatfacture.setMantantTotTTC(giveMeTotalMntTTc(listDetachatfacture));
			achatfacture.setMantantTotHT(giveMeTotalMntHT(listDetachatfacture));
			achatfacture.setTva20(giveMeTotalMntTVA20(listDetachatfacture));
			achatfacture.setTva7(giveMeTotalMntTVA7(listDetachatfacture));
			
			calculerMntTtc();
			
			PrimeFaces.current().executeScript("PF('dialogAddDetLivraison').hide()");
		}
	}

  public void afficherProduitsAchatFac() {
		if (idStock != 0) {
			initObjectStock();
			initObjectDetachatfacture();
			
			stock = stockService.findById(idStock);
			
			boolean existe = listDetachatfacture.stream().anyMatch(e -> e.getStock().getId().equals(idStock));

			if (existe == false) {
				detachatfacture.setRemiseAchat(0.0);
				detachatfacture.setQteacheter(0);
				detachatfacture.setUnitegratuit(0);
				detachatfacture.setPrixAchatHt(stock.getPahtGrossiste());
				detachatfacture.setPrixVenteAchatHT(stock.getPvaht());

				detachatfacture.setPrixAchatTtc(stock.getPattc());
				detachatfacture.setPrixVenteTtc(stock.getPvttc());
				detachatfacture.setBenepourcentage(stock.getBenifice());

				detachatfacture.setBeneficeDH(stock.getPvttc() - stock.getPattc());
				detachatfacture.setBenepourcentage(stock.getBenifice());
				detachatfacture.setStock(stock);

				PrimeFaces.current().executeScript("PF('dialogAddDetLivraison').show()");
			} else {
				FacesContext context = FacesContext.getCurrentInstance();
				FacesMessage message = new FacesMessage(bundle.getString("ceproduiExiste"));
				context.addMessage(null, message);
			}
		}
	}

  public void viderAjouter() {
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
		
		achatfacture.setTypeReglment(1);
		achatfacture.setNumAchat(num);
		achatfacture.setCodeAF(codeBLe);
		achatfacture.setManuelAutoMatique(1);
	}
	
	public void miseAjour() {
		boolean trvErreur = controle();
		if(trvErreur == false) {
			Repertoire repertoireFour = new Repertoire();
			repertoireFour.setId(idRepertoireFournisseur);
			achatfacture.setRepertoire(repertoireFour);
			
			if(null != achatfacture.getId() && achatfacture.getId() != 0) {
				//achatfacture.setMantantTotHTVA(achatfacture.getTvaArbtraire());
				achatfacture.setTvaArbtraire(achatfacture.getMantantTotHTVA());
				achatfactureService.modifier(achatfacture);
				
				supprimerListeDetAchatFact(achatfacture.getId());
				ajouterDetAchatLivr(listDetachatfacture, achatfacture);
				
				PrimeFaces.current().executeScript("PF('dialogAjouter').hide();");
			}else {
				//achatfacture.setMantantTotHTVA(achatfacture.getTvaArbtraire());
				achatfacture.setTvaArbtraire(achatfacture.getMantantTotHTVA());
				achatfacture.setSysDate(new Date());
				achatfacture.setEmployeOperateur(utilisateurConnecte);
				
				achatfactureService.ajouter(achatfacture);
				ajouterDetAchatLivr(listDetachatfacture, achatfacture);
			}
			
			initListDetachatfacture();
			initListDetachatfactureAncien();
			initObjectsAjout();
			rechercher();
		}
	}

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
            detachatfacture.setRemiseAchat(0.0);
				detachatfacture.setQteacheter(0);
				detachatfacture.setUnitegratuit(0);
				detachatfacture.setPrixAchatHt(stock.getPahtGrossiste());
				detachatfacture.setPrixVenteAchatHT(stock.getPvaht());

				detachatfacture.setPrixAchatTtc(stock.getPattc());
				detachatfacture.setPrixVenteTtc(stock.getPvttc());
				detachatfacture.setBenepourcentage(stock.getBenifice());

				detachatfacture.setBeneficeDH(stock.getPvttc() - stock.getPattc());
				detachatfacture.setBenepourcentage(stock.getBenifice());
				detachatfacture.setStock(stock);

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
              this.openCloseDialogSupprimerDetAchatSimple(true);
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

  public void validerProduits() {
		boolean trvErreur = controleProduit();
		if (trvErreur == false) {
			int qteachet = 0;
			int Totqqte = 0;
			int ug = 0;

			if (detachatfacture.getQteacheter() > 0) {
				qteachet = detachatfacture.getQteacheter();
			}
			if (detachatfacture.getUnitegratuit() > 0) {
				ug = detachatfacture.getUnitegratuit();
			}
			Stock stockMod = stockService.findById(stock.getId());
			Totqqte = stockMod.getQteFacturer() + (qteachet + ug);
			stockMod.setQteFacturer(Totqqte);
			detachatfacture.setStock(stockMod);

			listDetachatfacture.add(detachatfacture);
			idStock = 0;
			
			achatfacture.setMantantTotTTC(giveMeTotalMntTTc(listDetachatfacture));
			achatfacture.setMantantTotHT(giveMeTotalMntHT(listDetachatfacture));
			achatfacture.setTva20(giveMeTotalMntTVA20(listDetachatfacture));
			achatfacture.setTva7(giveMeTotalMntTVA7(listDetachatfacture));
			
			calculerMntTtc();
			
			PrimeFaces.current().executeScript("PF('dialogAddDetLivraison').hide()");
		}
	}

  public void calculerMontProd() {
		if (detachatfacture != null) {
			double prv = 0.0;
			double prattc = 0.0;
			int qteLivr = 0;
			double rmiseLivr = 0.0;
			double mntPro = 0.0;
			
			if (detachatfacture.getPrixVenteTtc() > 0.0) {
				prv = detachatfacture.getPrixVenteTtc();
			}
			if (detachatfacture.getPrixAchatTtc() > 0.0) {
				prattc = detachatfacture.getPrixAchatTtc();
			}
			if (detachatfacture.getQteacheter() > 0) {
				qteLivr = detachatfacture.getQteacheter();
			}
			if (detachatfacture.getRemiseAchat() > 0) {
				rmiseLivr = detachatfacture.getRemiseAchat();
			}

			if (detachatfacture.getRemiseAchat() == 0.0 && detachatfacture.getUnitegratuit() == 0) {
				mntPro = (prattc * qteLivr) - (((prattc * qteLivr) * rmiseLivr) / 100);
			} else {
				mntPro = (prv * qteLivr) - (((prv * qteLivr) * rmiseLivr) / 100);
			}

			detachatfacture.setMantantTTC(mntPro);
			if (detachatfacture.getStock().getTva() == 7) {
				double tv7 = 1.07;
				double prhht = detachatfacture.getMantantTTC() / tv7;
				detachatfacture.setMantantHt(prhht);
				detachatfacture.setTva7(detachatfacture.getMantantTTC() - detachatfacture.getMantantHt());

				detachatfacture.setTva20(0.0);
			} else {
				double tv7 = 1.2;
				double prhht = detachatfacture.getMantantTTC() / tv7;
				detachatfacture.setMantantHt(prhht);
				detachatfacture.setTva20(detachatfacture.getMantantTTC() - detachatfacture.getMantantHt());

				detachatfacture.setTva7(0.0);
			}
			
			int Totqqte = 0;

			Stock stockMod = stockService.findById(stock.getId());
			Totqqte = stockMod.getQteStock() - qteLivr;
			stockMod.setQteStock(Totqqte);
			
			detachatfacture.setStock(stockMod);
		}
	}
	
	public void calculerDroitSuuplemntaire() {
		if (achatfacture.getId() != null && achatfacture.getId() != 0) {
			double MNTTCCC = 0.0;
			double supAncien = 0.0;
			Achatfacture acht = achatfactureService.findById(achatfacture.getId());
			MNTTCCC = acht.getMantantTotTTC();
			if (acht.getMontantDroitSupplementaire() != 0) {
				supAncien = acht.getMontantDroitSupplementaire();
			}
			if (achatfacture != null && achatfacture.getMontantDroitSupplementaire() != 0) {
				if (achatfacture.getMontantDroitSupplementaire() - supAncien == 0) {
					if (achatfacture.getMantantTotTTC() == 0) {
						achatfacture.setMantantTotTTC(achatfacture.getMontantDroitSupplementaire());
					} else {
						achatfacture.setMantantTotTTC(acht.getMantantTotTTC());
					}
				} else {
					double mnttvvaa = 0.0;
					if (achatfacture.getMontantTVA7() != 0) {
						mnttvvaa += achatfacture.getMontantTVA7();
					}
					if (achatfacture.getMontantTVA10() != 0) {
						mnttvvaa += achatfacture.getMontantTVA10();
					}
					if (achatfacture.getMontantTVA14() != 0) {
						mnttvvaa += achatfacture.getMontantTVA14();
					}
					if (achatfacture.getMontantTVA20() != 0) {
						mnttvvaa += achatfacture.getMontantTVA20();
					}
					double droSup = achatfacture.getMontantDroitSupplementaire();
					
					achatfacture.setTvaArbtraire(mnttvvaa);
					achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + mnttvvaa + droSup);
				}
			} else {
				achatfacture.setMantantTotTTC(MNTTCCC - supAncien);
				if (achatfacture.getMontantTVA7() != 0) {
					calculerTva7();
				} else if (achatfacture.getMontantTVA10() != 0) {
					calculerTva10();
				} else if (achatfacture.getMontantTVA14() != 0) {
					calculerTva14();
				} else if (achatfacture.getMontantTVA20() != 0) {
					calculerTva20();
				} else {
					calculerAllTva();
				}
			}
		} else {
			if (achatfacture != null && achatfacture.getMontantDroitSupplementaire() != 0) {
				calculerAllTva();
			} else {
				if (achatfacture.getMontantTVA7() != 0) {
					calculerTva7();
				} else if (achatfacture.getMontantTVA10() != 0) {
					calculerTva10();
				} else if (achatfacture.getMontantTVA14() != 0) {
					calculerTva14();
				} else if (achatfacture.getMontantTVA20() != 0) {
					calculerTva20();
				} else {
					calculerAllTva();
				}
			}
		}
	}

	public void calculerTva7() {
		if (achatfacture != null) {
			if (achatfacture.getMontantTVA20() != 0 || achatfacture.getMontantTVA14() != 0 || achatfacture.getMontantTVA10() != 0) {
				calculerAllTva();
			} else {
				double drSup = achatfacture.getMontantDroitSupplementaire();
				
				achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + achatfacture.getMontantTVA7() + drSup);
				achatfacture.setTvaArbtraire(achatfacture.getMontantTVA7());
			}
		}
	}

	public void calculerTva20() {
		if (achatfacture != null) {
			if (achatfacture.getMontantTVA7() != 0 || achatfacture.getMontantTVA14() != 0 || achatfacture.getMontantTVA10() != 0) {
				calculerAllTva();
			} else {
				double drSup = achatfacture.getMontantDroitSupplementaire();
				
				achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + achatfacture.getMontantTVA20() + drSup);
				achatfacture.setTvaArbtraire(achatfacture.getMontantTVA20());
			}
		}
	}

	public void calculerTva10() {
		if (achatfacture != null) {
			if (achatfacture.getMontantTVA7() != 0 || achatfacture.getMontantTVA20() != 0 || achatfacture.getMontantTVA14() != 0) {
				calculerAllTva();
			} else {
				double drSup = achatfacture.getMontantDroitSupplementaire();
				
				achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + achatfacture.getMontantTVA10() + drSup);
				achatfacture.setTvaArbtraire(achatfacture.getMontantTVA10());
			}
		}
	}

	public void calculerTva14() {
		if (achatfacture != null) {
			if (achatfacture.getMontantTVA7() != 0 || achatfacture.getMontantTVA20() != 0 || achatfacture.getMontantTVA10() != 0) {
				calculerAllTva();
			} else {
				double drSup = achatfacture.getMontantDroitSupplementaire();
				
				achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + achatfacture.getMontantTVA14() + drSup);
				achatfacture.setTvaArbtraire(achatfacture.getMontantTVA14());
			}
		}
	}

	public void calculerAllTva() {
		if (achatfacture != null && achatfacture.getMantantTotHT() != 0) {
			double mnttvvaa = 0.0;
			if (achatfacture.getMontantTVA7() != 0) {
				mnttvvaa += achatfacture.getMontantTVA7();
			}
			if (achatfacture.getMontantTVA10() != 0) {
				mnttvvaa += achatfacture.getMontantTVA10();
			}
			if (achatfacture.getMontantTVA14() != 0) {
				mnttvvaa += achatfacture.getMontantTVA14();
			}
			if (achatfacture.getMontantTVA20() != 0) {
				mnttvvaa += achatfacture.getMontantTVA20();
			}
			double droSup = achatfacture.getMontantDroitSupplementaire();
			achatfacture.setTvaArbtraire(mnttvvaa);
			achatfacture.setMantantTotTTC(achatfacture.getMantantTotHT() + mnttvvaa + droSup);
		}
	}

  private double giveMeTotalMntHT(List<Detachatfacture> listDetachatfacture2) {
		double mntp = 0.0;
		for (Detachatfacture detachatfactures : listDetachatfacture2) {
			mntp += detachatfactures.getMantantHt();
		}
		double tot = methodCommun.convertrDouble(mntp);
		return tot;
	}

	private double giveMeTotalMntTTc(List<Detachatfacture> listDetachatfacture2) {
		double mntp = 0.0;
		for (Detachatfacture detachatfactures : listDetachatfacture2) {
			mntp += detachatfactures.getMantantTTC();
		}
		double tot = methodCommun.convertrDouble(mntp);
		return tot;
	}
	
	private double giveMeTotalMntTVA7(List<Detachatfacture> listDetachatfacture2) {
		double mntp = 0.0;
		for (Detachatfacture detachatfactures : listDetachatfacture2) {
			mntp += detachatfactures.getTva7();
		}
		double tot = methodCommun.convertrDouble(mntp);
		return tot;
	}

	private double giveMeTotalMntTVA20(List<Detachatfacture> listDetachatfacture2) {
		double mntp = 0.0;
		for (Detachatfacture detachatfactures : listDetachatfacture2) {
			mntp += detachatfactures.getTva20();
		}
		double tot = methodCommun.convertrDouble(mntp);
		return tot;
	}

  validerDetAchatFacture() {
      if(this.formGroup.get('stockId')?.value > BigInt(0) && this.formGroup.get('qte')?.value > 0) {
          let detAchatFacture: DetAchatFacture = initObjectDetAchatFacture();
          detAchatFacture.stockId = this.formGroup.get('stockId')?.value;
          detAchatFacture.qteacheter = this.formGroup.get('qte')?.value;
          detAchatFacture.pr = this.formGroup.get('prixVente')?.value;
          detAchatFacture.remiseAchat = this.formGroup.get('remiseAchat')?.value;
          detAchatFacture.unitegratuit = this.formGroup.get('unitegratuit')?.value;
          
          let stock: Stock = this.listStock.find((stock: Stock) => stock.id === this.formGroup.get('stockId')?.value) || initObjectStock();
          detAchatFacture.stock = stock;
          detAchatFacture.montant = (detAchatFacture.qte * detAchatFacture.prixVente) - (detAchatFacture.qte * detAchatFacture.prixVente * detAchatFacture.remise * 0.01);

          this.listDetAchatFacture.push(detAchatFacture);
          
          this.initDetAchatSimpleFormInformation();
          this.calculerTotal();
      }
  }

  supprimerDetAchatFacture() {
      this.listDetAchatFacture = this.listDetAchatFacture.filter((detAchatFacture: DetAchatFacture) => detAchatFacture.stockId !== this.detAchatFacture.stockId);
      this.calculerTotal();
      this.formGroup.updateValueAndValidity();
      this.openCloseDialogSupprimerDetAchatSimple(false);
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
                      this.listDetAchatFacture = data.detAchatSimples;

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
