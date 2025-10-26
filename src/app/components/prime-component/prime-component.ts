import { initObjectPrime, Prime } from '@/models/prime';
import { PrimeService } from '@/services/prime/prime-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-prime-component',
  imports: [],
  templateUrl: './prime-component.html',
  styleUrl: './prime-component.scss'
})
export class PrimeComponent {

  //Affichage Montant + Prime
  //Nouveau --> Montant + Prime

  listPrime: Prime[] = [];
  prime: Prime = initObjectPrime();
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private primeService: PrimeService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.getAllPrime();
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
      montant: [0, [Validators.required, Validators.min(1)]],
      prime: [0, [Validators.required, Validators.min(1)]],
    });
  }

  getAllPrime(): void {
    this.primeService.getAll().subscribe({
      next: (data: Prime[]) => {
        this.listPrime = data;
      }, error: (error: any) => {
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
    this.prime = initObjectPrime();
    this.initFormGroup();
  }

  recupperer(operation: number, primeEdit: Prime) {
    if(primeEdit && primeEdit.id) {
        this.prime = primeEdit;
        if(operation === 1) {
          this.formGroup.patchValue({
            montant: this.prime.montant,
            prime: this.prime.prime,
          });

          this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez réessayer l'opération" });
    }
  }

  updateList(prime: Prime, list: Prime[], operationType: OperationType, id?: bigint): Prime[] {
    if(operationType === OperationType.ADD) {
        list = [ ...list, prime ];
    } else if(operationType === OperationType.MODIFY) {
        let index = list.findIndex(x => x.id === prime.id);
        if(index > -1) {
            list[index] = prime;
        }
    } else if(operationType === OperationType.DELETE) {
        list = list.filter(x => x.id !== id);
    }
    return list;
  }

  checkIfListIsNull() {
    if(null == this.listPrime) {
        this.listPrime = [];
    }
  }

  mapFormGroupToObject(formGroup: FormGroup, prime: Prime): Prime {
    prime.montant = formGroup.get('montant')?.value;
    prime.prime = formGroup.get('prime')?.value;

    return prime;
  }

  async checkIfPaysExists(prime: Prime): Promise<boolean> {
    try {
      const existsObservable = this.primeService.exist(prime).pipe(
        catchError(error => {
          console.error('Error in prime existence observable:', error);
          return of(false); // Gracefully handle observable errors by returning false
        })
      );
      return await firstValueFrom(existsObservable);
    } catch (error) {
      console.error('Unexpected error checking if prime exists:', error);
      return false;
    }
  }

  async miseAjour(): Promise<void> {
    this.loadingService.show();
    let primeEdit: Prime = { ...this.prime };
    primeEdit = this.mapFormGroupToObject(this.formGroup, primeEdit);
    let primeSearch: Prime = { ...this.prime };
    let trvErreur = await this.checkIfPaysExists(primeSearch);
    
    if(!trvErreur) {
      this.mapFormGroupToObject(this.formGroup, this.prime);
      this.submitted = true;
      
      if(this.prime.id) {
        this.primeService.update(this.prime.id, this.prime).subscribe({
          next: (data) => {
              this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Mise à jour effectué avec succès' });
              this.checkIfListIsNull();
              this.listPrime = this.updateList(data, this.listPrime, OperationType.MODIFY);
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
        this.primeService.create(this.prime).subscribe({
            next: (data: Prime) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Ajout effectué avec succès' });
                this.checkIfListIsNull();
                this.listPrime = this.updateList(data, this.listPrime, OperationType.ADD);
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
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Le prime existe deja" });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.prime && this.prime.id) {
      this.loadingService.show();
      let id = this.prime.id;
      this.primeService.delete(this.prime.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: 'Succès', closable: true, detail: 'Suppression avec succès' });
            this.checkIfListIsNull();
            this.listPrime = this.updateList(initObjectPrime(), this.listPrime, OperationType.DELETE, id);
            this.prime = initObjectPrime() ;
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
