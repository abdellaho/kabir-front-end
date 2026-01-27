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
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CompteCaisse, initObjectCompteCourant } from '@/models/compte-caisse';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { CompteCaisseService } from '@/services/compte-caisse/compte-caisse-service';
import { StateService } from '@/state/state-service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { CompteCaisseSearch, initObjectCompteCourantSearch } from '@/shared/classes/search/compte-caisse-search';
import { OperationType } from '@/shared/enums/operation-type';
import { mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';

@Component({
    selector: 'app-compte-courant-component',
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
    templateUrl: './compte-courant-component.html',
    styleUrl: './compte-courant-component.scss'
})
export class CompteCourantComponent {
    personnelCreationId: number | null = null;
    isValid: boolean = false;
    listCaisse: CompteCaisse[] = [];
    caisse: CompteCaisse = initObjectCompteCourant();
    selectedCaisse!: CompteCaisse;
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private compteCaisseService: CompteCaisseService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.search();
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
            designation: [''],
            numFacture: [''],
            date: [new Date(), [Validators.required]],
            montant: [0, [Validators.required]]
        });
    }

    search() {
        this.getAllCaisse();
    }

    getAllCaisse(): void {
        this.listCaisse = [];
        let compteCaisseSearch: CompteCaisseSearch = initObjectCompteCourantSearch();
        this.compteCaisseService.search(compteCaisseSearch).subscribe({
            next: (data: CompteCaisse[]) => {
                this.listCaisse = data;
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
                this.loadingService.hide();
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
        this.caisse = initObjectCompteCourant();
        this.initFormGroup();
    }

    recupperer(operation: number, caisseEdit: CompteCaisse) {
        if (caisseEdit && caisseEdit.id) {
            if (operation === 1) {
                this.compteCaisseService.getById(caisseEdit.id).subscribe({
                    next: (data: CompteCaisse) => {
                        this.caisse = data;

                        this.formGroup.patchValue({
                            designation: this.caisse.designation,
                            numFacture: this.caisse.numFacture,
                            date: new Date(this.caisse.date),
                            montant: this.caisse.montant
                        });

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
                this.caisse = structuredClone(caisseEdit);
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(caisse: CompteCaisse, list: CompteCaisse[], operationType: OperationType, id?: bigint): CompteCaisse[] {
        if (operationType === OperationType.ADD) {
            list = [...list, caisse];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === caisse.id);
            if (index > -1) {
                list[index] = caisse;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listCaisse) {
            this.listCaisse = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, caisse: CompteCaisse): CompteCaisse {
        caisse.date = mapToDateTimeBackEnd(formGroup.get('date')?.value);
        caisse.montant = formGroup.get('montant')?.value;
        caisse.designation = formGroup.get('designation')?.value;
        caisse.numFacture = formGroup.get('numFacture')?.value;

        return caisse;
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let bonSortieEdit: CompteCaisse = { ...this.caisse };
        this.mapFormGroupToObject(this.formGroup, bonSortieEdit);
        let trvErreur = false; // await this.checkIfExists(bonSortieEdit);

        if (!trvErreur) {
            this.caisse = this.mapFormGroupToObject(this.formGroup, this.caisse);

            if (this.caisse.id) {
                this.compteCaisseService.update(this.caisse.id, this.caisse).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCaisse = this.updateList(data, this.listCaisse, OperationType.MODIFY);
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
                this.compteCaisseService.create(this.caisse).subscribe({
                    next: (data: CompteCaisse) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCaisse = this.updateList(data, this.listCaisse, OperationType.ADD);
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
        if (this.caisse && this.caisse.id) {
            this.loadingService.show();
            let id = this.caisse.id;
            this.compteCaisseService.delete(this.caisse.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listCaisse = this.updateList(initObjectCompteCourant(), this.listCaisse, OperationType.DELETE, id);
                    this.caisse = initObjectCompteCourant();
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
