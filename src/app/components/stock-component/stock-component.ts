import { Fournisseur } from '@/models/fournisseur';
import { initObjectStock, Stock } from '@/models/stock';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { StockService } from '@/services/stock/stock-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-stock-component',
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
    SelectModule
  ],
  templateUrl: './stock-component.html',
  styleUrl: './stock-component.scss'
})
export class StockComponent {

  //Buttons ---> Ajouter + Rechercher + Actualiser + Archiver + Corbeille
  //Tableau ---> Designation + St Depot + st Facture + st mag + PA + PV.I + Prix comm + PV min + Remise max + Benif + Fourniss
  //Ajouter ---> Fourniss* + Designation* + PA* + PComm + PV* + TVA* + Benif + st mag + st fact + st depot

  /*
    PV1   QTE1  Remise1

    PV2   QTE2  Remise2

    PV3   QTE3  Remise3

    PV4   QTE4  Remise4


    MT1   Prime1
    MT2   Prime2
    MT3   Prime3

  */

  listFournisseur: Fournisseur[] = [];
  listStock: Stock[] = [];
  stock: Stock = initObjectStock();
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private fournisseurService: FournisseurService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
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
      designation: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      fournisseurId: [0, [Validators.required, Validators.min(1)]],
      prixCommercial: [0, [Validators.required, Validators.min(0)]],
      pvttc: [0, [Validators.required, Validators.min(0)]],
      pattc: [0, [Validators.required, Validators.min(0)]],
      tva: [20, [Validators.required, Validators.min(0)]],
      benifice: [0, [Validators.required, Validators.min(0)]],
      qteStock: [0, [Validators.required, Validators.min(0)]],
      qteFacturer: [0, [Validators.required, Validators.min(0)]],
      qteStockImport: [0, [Validators.required, Validators.min(0)]],
      prixVentMin1: [0, [Validators.required, Validators.min(0)]],
      prixVentMin2: [0, [Validators.required, Validators.min(0)]],
      prixVentMin3: [0, [Validators.required, Validators.min(0)]],
      prixVentMin4: [0, [Validators.required, Validators.min(0)]],
      qtePVMin1: [0, [Validators.required, Validators.min(0)]],
      qtePVMin2: [0, [Validators.required, Validators.min(0)]],
      qtePVMin3: [0, [Validators.required, Validators.min(0)]],
      qtePVMin4: [0, [Validators.required, Validators.min(0)]],
      remiseMax1: [0, [Validators.required, Validators.min(0)]],
      remiseMax2: [0, [Validators.required, Validators.min(0)]],
      remiseMax3: [0, [Validators.required, Validators.min(0)]],
      remiseMax4: [0, [Validators.required, Validators.min(0)]],
      montant1: [0, [Validators.required, Validators.min(0)]],
      montant2: [0, [Validators.required, Validators.min(0)]],
      montant3: [0, [Validators.required, Validators.min(0)]],
      prime1: [0, [Validators.required, Validators.min(0)]],
      prime2: [0, [Validators.required, Validators.min(0)]],
      prime3: [0, [Validators.required, Validators.min(0)]],
    });
  }

  getAllStock(): void {
    this.stockService.getAll().subscribe({
      next: (data: Stock[]) => {
        this.listStock = data;
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  getAllFournisseur(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data: Fournisseur[]) => {
        this.listFournisseur = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  openCloseDialogAjouter(openClose: boolean): void {
    this.dialogAjouter = openClose;
  }

  openCloseDialogSupprimer(openClose: boolean): void {
    this.dialogSupprimer = openClose;
  }

  viderAjouter() {
    this.openCloseDialogAjouter(true);
    this.submitted = false;
    this.stock = initObjectStock();
    this.initFormGroup();
  }

  recupperer(operation: number, stockEdit: Stock) {
    if(stockEdit && stockEdit.id) {
        this.stock = stockEdit;
        if(operation === 1) {
          this.formGroup.patchValue({
            designation: this.stock.designation,
            fournisseurId: this.stock.fournisseurId,
            prixCommercial: this.stock.prixCommercial,
            pattc: this.stock.pattc,
            pvttc: this.stock.pvttc,
            tva: this.stock.tva,
            benifice: this.stock.benifice,
            qteStock: this.stock.qteStock,
            qteFacturer: this.stock.qteFacturer,
            qteStockImport: this.stock.qteStockImport,
            prixVentMin1: this.stock.prixVentMin1,
            prixVentMin2: this.stock.prixVentMin2,
            prixVentMin3: this.stock.prixVentMin3,
            prixVentMin4: this.stock.prixVentMin4,
            qtePVMin1: this.stock.qtePVMin1,
            qtePVMin2: this.stock.qtePVMin2,
            qtePVMin3: this.stock.qtePVMin3,
            qtePVMin4: this.stock.qtePVMin4,
            remiseMax1: this.stock.remiseMax1,
            remiseMax2: this.stock.remiseMax2,
            remiseMax3: this.stock.remiseMax3,
            remiseMax4: this.stock.remiseMax4,
            montant1: this.stock.montant1,
            montant2: this.stock.montant2,
            montant3: this.stock.montant3,
            prime1: this.stock.prime1,
            prime2: this.stock.prime2,
            prime3: this.stock.prime3,
          });

          this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(stock: Stock, list: Stock[], operationType: OperationType, id?: bigint): Stock[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, stock ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === stock.id);
        if(index > -1) {
            list[index] = stock;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listStock) {
        this.listStock = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, stock: Stock): Stock {
    stock.designation= formGroup.get('designation')?.value;
    stock.fournisseurId = formGroup.get('fournisseurId')?.value;
    stock.prixCommercial = formGroup.get('prixCommercial')?.value;
    stock.pattc = formGroup.get('pattc')?.value;
    stock.tva = formGroup.get('tva')?.value;
    stock.benifice = formGroup.get('benifice')?.value;
    stock.qteStock = formGroup.get('qteStock')?.value;
    stock.qteFacturer = formGroup.get('qteFacturer')?.value;
    stock.qteStockImport = formGroup.get('qteStockImport')?.value;
    stock.prixVentMin1 = formGroup.get('prixVentMin1')?.value;
    stock.prixVentMin2 = formGroup.get('prixVentMin2')?.value;
    stock.prixVentMin3 = formGroup.get('prixVentMin3')?.value;
    stock.prixVentMin4 = formGroup.get('prixVentMin4')?.value;
    stock.qtePVMin1 = formGroup.get('qtePVMin1')?.value;
    stock.qtePVMin2 = formGroup.get('qtePVMin2')?.value;
    stock.qtePVMin3 = formGroup.get('qtePVMin3')?.value;
    stock.qtePVMin4 = formGroup.get('qtePVMin4')?.value;
    stock.remiseMax1 = formGroup.get('remiseMax1')?.value;
    stock.remiseMax2 = formGroup.get('remiseMax2')?.value;
    stock.remiseMax3 = formGroup.get('remiseMax3')?.value;
    stock.remiseMax4 = formGroup.get('remiseMax4')?.value;
    stock.montant1 = formGroup.get('montant1')?.value;
    stock.montant2 = formGroup.get('montant2')?.value;
    stock.montant3 = formGroup.get('montant3')?.value;
    stock.prime1 = formGroup.get('prime1')?.value;
    stock.prime2 = formGroup.get('prime2')?.value;
    stock.prime3 = formGroup.get('prime3')?.value;

    return stock;
  }

  async checkIfPaysExists(stock: Stock): Promise<boolean> {
    try {
      const existsObservable = this.stockService.exist(stock).pipe(
        catchError(error => {
          console.error('Error in stock existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if stock exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let stockEdit: Stock = { ...this.stock };
    this.mapFormGroupToObject(this.formGroup, stockEdit);
    let absenceSearch: Stock = { ...this.stock };
    let trvErreur = await this.checkIfPaysExists(absenceSearch);
    
    if(!trvErreur) {
      this.mapFormGroupToObject(this.formGroup, this.stock);
      this.submitted = true;
      
      if(this.stock.id) {
        this.stockService.update(this.stock.id, this.stock).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listStock = this.updateList(data, this.listStock, OperationType.MODIFY);
              this.openCloseDialogAjouter(false);
          }, error: (err) => {
              console.log(err);
              this.loadingService.hide();
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.stockService.create(this.stock).subscribe({
            next: (data: Stock) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listStock = this.updateList(data, this.listStock, OperationType.ADD);
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le stock existe deja" });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.stock && this.stock.id) {
      this.loadingService.show();
      let id = this.stock.id;
      this.stockService.delete(this.stock.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listStock = this.updateList(initObjectStock(), this.listStock, OperationType.DELETE, id);
            this.stock = initObjectStock() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
        }, complete: () => {
          this.loadingService.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur s'est produite" });
    }

    this.openCloseDialogSupprimer(false);
  }

}
