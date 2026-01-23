import { Cheque, initObjectCheque } from '@/models/cheque';
import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { ChequeService } from '@/services/cheque/cheque-service';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { arrayToMap, getElementFromMap, initObjectSearch, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { OperationType } from '@/shared/enums/operation-type';
import { TypeSearch } from '@/shared/enums/type-search';
import { LoadingService } from '@/shared/services/loading-service';
import { StateService } from '@/state/state-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
    selector: 'app-cheque-component',
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
        InputTextModule,
        CheckboxModule,
        ToggleSwitchModule
    ],
    templateUrl: './cheque-component.html',
    styleUrl: './cheque-component.scss'
})
export class ChequeComponent {
    // Comme l'ancien sauf supprimer type dans l'ajout
    //Tableau --> repertoire + numero + montant + date cheque + etat cheque + footer(montantStck + montantCredit + montantCheque)
    //Ajouter -->  repertoire + date cheque + montant + numero + etat cheque

    personnelCreationId: number | null = null;
    isValid: boolean = false;
    listCheque: Cheque[] = [];
    cheque: Cheque = initObjectCheque();
    selectedCheque!: Cheque;
    mapOfFournisseur: Map<number, string> = new Map<number, string>();
    listFournisseur: Fournisseur[] = [];
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private chequeService: ChequeService,
        private fournisseurService: FournisseurService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.search();
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
            numero: [{ value: '', disabled: true }],
            dateCheque: [new Date(), [Validators.required]],
            fournisseurId: [BigInt(0), [Validators.required, Validators.min(1)]],
            montant: [0, [Validators.required]],
            etatcheque: [false]
        });
    }

    search() {
        this.getAllCheque();
    }

    getAllCheque(): void {
        this.listCheque = [];
        this.chequeService.getAll().subscribe({
            next: (data: Cheque[]) => {
                this.listCheque = data;
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
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
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getDesignationFournisseur(id: number) {
        return getElementFromMap(this.mapOfFournisseur, id);
    }

    openCloseDialogAjouter(openClose: boolean): void {
        this.dialogAjouter = openClose;
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    async viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.cheque = initObjectCheque();
        await this.generateNumCheque(this.cheque);

        this.initFormGroup();

        this.formGroup.patchValue({
            codeSortie: this.cheque.codeCheque
        });
        this.formGroup.get('codeSortie')?.disable();
    }

    recupperer(operation: number, chequeEdit: Cheque) {
        if (chequeEdit && chequeEdit.id) {
            if (operation === 1) {
                this.chequeService.getById(chequeEdit.id).subscribe({
                    next: (data: Cheque) => {
                        this.cheque = data;

                        this.formGroup.patchValue({
                            numero: this.cheque.numero,
                            dateCheque: this.cheque.dateCheque,
                            fournisseurId: this.cheque.fournisseurId,
                            montant: this.cheque.montant,
                            etatcheque: this.cheque.etatcheque
                        });
                        this.formGroup.get('numero')?.disable();
                        this.formGroup.updateValueAndValidity();

                        this.openCloseDialogAjouter(true);
                    },
                    error: (error: any) => {
                        console.error(error);
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else if (operation === 2) {
                this.cheque = structuredClone(chequeEdit);
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(cheque: Cheque, list: Cheque[], operationType: OperationType, id?: bigint): Cheque[] {
        if (operationType === OperationType.ADD) {
            list = [...list, cheque];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === cheque.id);
            if (index > -1) {
                list[index] = cheque;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listCheque) {
            this.listCheque = [];
        }
    }

    async generateNumCheque(cheque: Cheque) {
        let num: number = 0;
        num = await this.getLastNumBonSortie();

        let codbl = num + '';
        let codeBLe = '';
        if (codbl.length == 1) {
            codeBLe = 'H000' + num;
        } else if (codbl.length == 2) {
            codeBLe = 'H00' + num;
        }
        if (codbl.length >= 3) {
            codeBLe = 'H0' + num;
        }

        cheque.numCheque = num;
        cheque.codeCheque = codeBLe;

        return cheque;
    }

    async getLastNumBonSortie(): Promise<number> {
        try {
            const existsObservable = this.chequeService.generateNumCheque().pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of(1); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return 1;
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, cheque: Cheque): Cheque {
        cheque.dateCheque = mapToDateTimeBackEnd(formGroup.get('dateCheque')?.value);
        cheque.fournisseurId = formGroup.get('fournisseurId')?.value;
        cheque.montant = formGroup.get('montant')?.value;
        cheque.etatcheque = formGroup.get('etatcheque')?.value;

        return cheque;
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let bonSortieEdit: Cheque = { ...this.cheque };
        this.mapFormGroupToObject(this.formGroup, bonSortieEdit);
        let trvErreur = false; // await this.checkIfExists(bonSortieEdit);

        if (!trvErreur) {
            this.cheque = this.mapFormGroupToObject(this.formGroup, this.cheque);

            if (this.cheque.id) {
                this.chequeService.update(this.cheque.id, this.cheque).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCheque = this.updateList(data, this.listCheque, OperationType.MODIFY);
                        this.openCloseDialogAjouter(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: this.msg.summary.labelError,
                            detail: this.msg.messages.messageErrorProduite
                        });
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else {
                this.chequeService.create(this.cheque).subscribe({
                    next: (data: Cheque) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCheque = this.updateList(data, this.listCheque, OperationType.ADD);
                        this.openCloseDialogAjouter(false);
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: this.msg.summary.labelError,
                            detail: this.msg.messages.messageErrorProduite
                        });
                    },
                    complete: () => {
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
        if (this.cheque && this.cheque.id) {
            this.loadingService.show();
            let id = this.cheque.id;
            this.chequeService.delete(this.cheque.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listCheque = this.updateList(initObjectCheque(), this.listCheque, OperationType.DELETE, id);
                    this.cheque = initObjectCheque();
                },
                error: (err) => {
                    console.log(err);
                    this.loadingService.hide();
                    this.messageService.add({
                        severity: 'error',
                        summary: this.msg.summary.labelError,
                        detail: this.msg.messages.messageErrorProduite
                    });
                },
                complete: () => {
                    this.loadingService.hide();
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
        }

        this.openCloseDialogSupprimer(false);
    }
}
