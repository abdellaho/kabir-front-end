import { initObjectPrime, Prime } from '@/models/prime';
import { PrimeService } from '@/services/prime/prime-service';
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
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { NegativeValidator } from '@/validators/negative-validator';
import { returnValueOfNumberProperty } from '@/shared/classes/generic-methods';

@Component({
  selector: 'app-prime-component',
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
    InputTextModule
  ],
  templateUrl: './prime-component.html',
  styleUrl: './prime-component.scss'
})
export class PrimeComponent {

  //Affichage Montant + Prime
  //Nouveau --> Montant + Prime

  listPrime: Prime[] = [];
  prime: Prime = initObjectPrime();
  selectedPrime!: Prime;
  mapOfPersonnels: Map<number, string> = new Map<number, string>();
  dialogSupprimer: boolean = false;
  dialogAjouter: boolean = false;
  submitted: boolean = false;
  formGroup!: FormGroup;
  msg = APP_MESSAGES;

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
      montant: [null, [Validators.required, NegativeValidator]],
      prime: [null, [Validators.required, NegativeValidator]],
    });
  }

  getAllPrime(): void {
    this.primeService.getAll().subscribe({
      next: (data: Prime[]) => {
        this.listPrime = data;
        this.sortList();
      }, error: (error: any) => {
        console.error(error);
      }
    });
  }

  sortList(): void {
    this.listPrime.sort((a: Prime, b: Prime) => a.montant - b.montant);
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
            montant: returnValueOfNumberProperty(this.prime.montant),
            prime: returnValueOfNumberProperty(this.prime.prime),
          });

          this.openCloseDialogAjouter(true);
        } else {
            this.openCloseDialogSupprimer(true);
        }
    } else {
        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
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
    prime.montant = formGroup.get('montant')?.value ?? 0;
    prime.prime = formGroup.get('prime')?.value ?? 0;

    console.log(formGroup.get('montant')?.value);
    console.log(formGroup.get('prime')?.value);
    console.log(prime);

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
              this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });
              this.checkIfListIsNull();
              this.listPrime = this.updateList(data, this.listPrime, OperationType.MODIFY);
              this.sortList();
              this.openCloseDialogAjouter(false);
          }, error: (err) => {
              console.log(err);
              this.loadingService.hide();
              this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
          }, complete: () => {
            this.loadingService.hide();
          }
        });
      } else {
        this.primeService.create(this.prime).subscribe({
            next: (data: Prime) => {
                this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });
                this.checkIfListIsNull();
                this.listPrime = this.updateList(data, this.listPrime, OperationType.ADD);
                this.sortList();
                this.openCloseDialogAjouter(false);
            }, error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
            }, complete: () => {
              this.loadingService.hide();
            }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.prime.label} ${this.msg.messages.messageExistDeja}` });
      this.loadingService.hide();
    }
  }

  supprimer(): void {
    if(this.prime && this.prime.id) {
      this.loadingService.show();
      let id = this.prime.id;
      this.primeService.delete(this.prime.id).subscribe({
        next: (data) => {
            this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageDeleteSuccess });
            this.checkIfListIsNull();
            this.listPrime = this.updateList(initObjectPrime(), this.listPrime, OperationType.DELETE, id);
            this.sortList();
            this.prime = initObjectPrime() ;
        }, error: (err) => {
            console.log(err);
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
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
