import { Caisse, initObjectCaisse } from '@/models/caisse';
import { CaisseService } from '@/services/caisse/caisse-service';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypeOperationCaisse } from '@/shared/enums/type-operation-caisse';
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
    selector: 'app-caisse-component',
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
    templateUrl: './caisse-component.html',
    styleUrl: './caisse-component.scss'
})
export class CaisseComponent {
    //Comme l'ancienne application
    //Tableau --> dateOperation + montant + type(Versement + retrait) + Actions
    //Ajouter --> type(Versement + retrait) + dateOperation + montant

    personnelCreationId: number | null = null;
    isValid: boolean = false;
    listCaisse: Caisse[] = [];
    caisse: Caisse = initObjectCaisse();
    selectedCaisse!: Caisse;
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;
    typeOperationCaisse: { label: string; value: number }[] = filteredTypeOperationCaisse;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private caisseService: CaisseService,
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
            dateOperation: [new Date(), [Validators.required]],
            montant: [0, [Validators.required]],
            type: [0]
        });
    }

    search() {
        this.getAllCaisse();
    }

    getAllCaisse(): void {
        this.listCaisse = [];
        this.caisseService.getAll().subscribe({
            next: (data: Caisse[]) => {
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
        this.caisse = initObjectCaisse();
        this.initFormGroup();
    }

    getType(type: number): string {
        let filteredType = this.typeOperationCaisse.filter((t) => t.value === type);
        return filteredType.length > 0 ? filteredType[0].label : '';
    }

    recupperer(operation: number, caisseEdit: Caisse) {
        if (caisseEdit && caisseEdit.id) {
            if (operation === 1) {
                this.caisseService.getById(caisseEdit.id).subscribe({
                    next: (data: Caisse) => {
                        this.caisse = data;

                        this.formGroup.patchValue({
                            dateOperation: this.caisse.dateOperation,
                            montant: this.caisse.montant,
                            type: this.caisse.type
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

    updateList(caisse: Caisse, list: Caisse[], operationType: OperationType, id?: bigint): Caisse[] {
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

    mapFormGroupToObject(formGroup: FormGroup, caisse: Caisse): Caisse {
        caisse.dateOperation = mapToDateTimeBackEnd(formGroup.get('dateOperation')?.value);
        caisse.montant = formGroup.get('montant')?.value;
        caisse.type = formGroup.get('type')?.value;

        return caisse;
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let bonSortieEdit: Caisse = { ...this.caisse };
        this.mapFormGroupToObject(this.formGroup, bonSortieEdit);
        let trvErreur = false; // await this.checkIfExists(bonSortieEdit);

        if (!trvErreur) {
            this.caisse = this.mapFormGroupToObject(this.formGroup, this.caisse);

            if (this.caisse.id) {
                this.caisseService.update(this.caisse.id, this.caisse).subscribe({
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
                this.caisseService.create(this.caisse).subscribe({
                    next: (data: Caisse) => {
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
            this.caisseService.delete(this.caisse.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listCaisse = this.updateList(initObjectCaisse(), this.listCaisse, OperationType.DELETE, id);
                    this.caisse = initObjectCaisse();
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
