import { Compta, initObjectCompta } from '@/models/compta';
import { ComptaService } from '@/services/compta/compta-service';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { AllValidationErrors, getFormValidationErrors, getLastDayOfMonth, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { ComptaRequest } from '@/shared/classes/requests/compta-request';
import { ComptaResponse, initObjectComptaResponse } from '@/shared/classes/responses/compta-response';
import { ComptaSearch, initComptaSearch } from '@/shared/classes/search/compta-search';
import { initObjectCompteCourantSearch } from '@/shared/classes/search/compte-caisse-search';
import { OperationType } from '@/shared/enums/operation-type';
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
    selector: 'app-compta-component',
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
    templateUrl: './compta-component.html',
    styleUrl: './compta-component.scss'
})
export class ComptaComponent {
    //Comme l'ancienne application
    //Tableau --> dateOperation + montant + type(Versement + retrait) + Actions
    //Ajouter --> type(Versement + retrait) + dateOperation + montant

    personnelCreationId: number | null = null;
    isValid: boolean = false;
    listCompta: Compta[] = [];
    compta: Compta = initObjectCompta();
    selectedCompta!: Compta;
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    disabledMontants: boolean = false;
    disabledDate: boolean = false;
    msg = APP_MESSAGES;
    readonly BigInt = BigInt; // Expose BigInt to template

    constructor(
        private comptaService: ComptaService,
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
            dateDebut: [new Date(), [Validators.required]],
            dateFin: [new Date(), [Validators.required]],
            montantTVAPrecedent: [0],
            montantTVAAchat: [0],
            montantTVAVente: [0],
            resutMnt: [0]
        });

        this.formGroup.get('resutMnt')?.disable();
    }

    search() {
        this.getAllCompta();
    }

    getAllCompta(): void {
        this.listCompta = [];
        this.comptaService.getAll().subscribe({
            next: (data: Compta[]) => {
                this.listCompta = data;
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

    async getComptaLast(): Promise<Compta | null> {
        try {
            const existsObservable = this.comptaService.getLast().pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of(null); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return null;
        }
    }

    async getComptaResponse(comptaRequest: ComptaRequest): Promise<ComptaResponse> {
        try {
            const existsObservable = this.comptaService.getGlobalSums(comptaRequest).pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of(initObjectComptaResponse()); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return initObjectComptaResponse();
        }
    }

    async checkIsLast(comptaSearch: ComptaSearch): Promise<boolean> {
        try {
            const existsObservable = this.comptaService.checkIsLast(comptaSearch).pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return false;
        }
    }

    isFormValid(): boolean {
        const controls = this.formGroup.controls;

        const dateDebutValid = controls['dateDebut'].errors === null;
        const dateFinValid = controls['dateFin'].errors === null;

        return dateDebutValid && dateFinValid;
    }

    async viderAjouter() {
        this.initFormGroup();
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.compta = initObjectCompta();
        let comptaLast = await this.getComptaLast();

        if (comptaLast) {
            this.disabledMontants = true;
            this.disabledDate = true;

            let dateDebutLast = comptaLast.dateDebut;
            let dateDebut = new Date(dateDebutLast);
            dateDebut.setMonth(dateDebut.getMonth() + 1);
            dateDebut.setDate(1);

            this.compta.dateDebut = dateDebut;
            this.compta.montantTVAPrecedent = comptaLast.resutMnt;
        } else {
            let dateDebut = this.compta.dateDebut;
            if (dateDebut.getDate() > 1) {
                dateDebut.setDate(1);
            }
            let dateFin = getLastDayOfMonth(dateDebut);

            this.compta.dateDebut = dateDebut;
            this.compta.dateFin = dateFin;
        }

        this.mapObjectToFormGroup(this.formGroup, this.compta, this.disabledMontants, this.disabledDate);
        await this.rechercheMntTVA();

        this.formGroup.updateValueAndValidity();
    }

    async rechercheMntTVA() {
        if (this.formGroup.get('dateDebut')?.value) {
            let dateDebut = this.formGroup.get('dateDebut')?.value;

            if (dateDebut.getDate() > 1) {
                dateDebut.setDate(1);
            }
            let dateFin = getLastDayOfMonth(dateDebut);

            this.formGroup.patchValue({
                dateDebut: dateDebut,
                dateFin: dateFin
            });

            let comptaRequest = {
                dateDebut: mapToDateTimeBackEnd(dateDebut),
                dateFin: mapToDateTimeBackEnd(dateFin)
            };

            let comptaResponse = await this.getComptaResponse(comptaRequest);
            this.formGroup.patchValue({
                montantTVAAchat: comptaResponse.achatTvaSum,
                montantTVAVente: comptaResponse.tva20Sum + comptaResponse.tva7Sum
            });
            this.calcultResultTVA();
        }

        this.formGroup.updateValueAndValidity();
    }

    calcultResultTVA() {
        let tvaAcht = this.formGroup.get('montantTVAAchat')?.value;
        let tvaPrc = this.formGroup.get('montantTVAPrecedent')?.value;
        let tvaVente = this.formGroup.get('montantTVAVente')?.value;

        if (tvaPrc < 0) {
            this.formGroup.get('resutMnt')?.setValue(tvaVente - tvaAcht + tvaPrc);
        } else {
            this.formGroup.get('resutMnt')?.setValue(tvaVente - tvaAcht);
        }

        this.formGroup.get('resutMnt')?.disable();
    }

    mapObjectToFormGroup(formGroup: FormGroup, compta: Compta, disabledMontants: boolean, disabledDate: boolean) {
        formGroup.patchValue({
            dateDebut: new Date(compta.dateDebut),
            dateFin: new Date(compta.dateFin),
            montantTVAPrecedent: compta.montantTVAPrecedent,
            montantTVAAchat: compta.montantTVAAchat,
            montantTVAVente: compta.montantTVAVente,
            resutMnt: compta.resutMnt
        });

        formGroup.get('resutMnt')?.disable();

        this.enableDisableDate(disabledDate);
        this.enableDisableMontants(disabledMontants);

        formGroup.updateValueAndValidity();
    }

    enableDisableDate(disabledDate: boolean) {
        if (disabledDate) {
            this.formGroup.get('dateDebut')?.disable();
            this.formGroup.get('dateFin')?.disable();
        } else {
            this.formGroup.get('dateDebut')?.enable();
            this.formGroup.get('dateFin')?.enable();
        }
    }

    enableDisableMontants(disabledMontants: boolean) {
        if (disabledMontants) {
            this.formGroup.get('montantTVAPrecedent')?.disable();
            this.formGroup.get('montantTVAAchat')?.disable();
            this.formGroup.get('montantTVAVente')?.disable();
        } else {
            this.formGroup.get('montantTVAPrecedent')?.enable();
            this.formGroup.get('montantTVAAchat')?.enable();
            this.formGroup.get('montantTVAVente')?.enable();
        }
    }

    recupperer(operation: number, comptaEdit: Compta) {
        if (comptaEdit && comptaEdit.id) {
            if (operation === 1) {
                this.comptaService.getById(comptaEdit.id).subscribe({
                    next: (data: Compta) => {
                        this.compta = data;

                        this.formGroup.patchValue({
                            dateDebut: new Date(this.compta.dateDebut),
                            dateFin: new Date(this.compta.dateFin),
                            montantTVAPrecedent: this.compta.montantTVAPrecedent,
                            montantTVAAchat: this.compta.montantTVAAchat,
                            montantTVAVente: this.compta.montantTVAVente,
                            resutMnt: this.compta.resutMnt
                        });

                        this.disabledMontants = true;
                        this.disabledDate = true;

                        this.enableDisableMontants(this.disabledMontants);
                        this.enableDisableDate(this.disabledDate);
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
                this.compta = structuredClone(comptaEdit);
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(compta: Compta, list: Compta[], operationType: OperationType, id?: bigint): Compta[] {
        if (operationType === OperationType.ADD) {
            list = [...list, compta];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === compta.id);
            if (index > -1) {
                list[index] = compta;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listCompta) {
            this.listCompta = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, compta: Compta): Compta {
        compta.dateDebut = mapToDateTimeBackEnd(formGroup.get('dateDebut')?.value);
        compta.dateFin = mapToDateTimeBackEnd(formGroup.get('dateFin')?.value);
        compta.montantTVAPrecedent = formGroup.get('montantTVAPrecedent')?.value;
        compta.montantTVAAchat = formGroup.get('montantTVAAchat')?.value;
        compta.montantTVAVente = formGroup.get('montantTVAVente')?.value;
        compta.resutMnt = formGroup.get('resutMnt')?.value;

        return compta;
    }

    async miseAjour(): Promise<void> {
        this.submitted = true;
        this.loadingService.show();
        let comptaEdit: Compta = { ...this.compta };
        this.mapFormGroupToObject(this.formGroup, comptaEdit);
        let trvErreur = false; // await this.checkIfExists(comptaEdit);

        if (!trvErreur) {
            this.compta = this.mapFormGroupToObject(this.formGroup, this.compta);

            if (this.compta.id) {
                this.comptaService.update(this.compta.id, this.compta).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCompta = this.updateList(data, this.listCompta, OperationType.MODIFY);
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
                this.comptaService.create(this.compta).subscribe({
                    next: (data: Compta) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });

                        this.checkIfListIsNull();
                        this.listCompta = this.updateList(data, this.listCompta, OperationType.ADD);
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

    async supprimer(): Promise<void> {
        if (this.compta && this.compta.id) {
            this.loadingService.show();
            let id = this.compta.id;
            let comptaSearch: ComptaSearch = initComptaSearch();
            comptaSearch.dateFin = this.compta.dateFin;

            let isLast = await this.checkIsLast(comptaSearch);

            if (!isLast) {
                this.messageService.add({
                    severity: 'error',
                    summary: this.msg.summary.labelError,
                    detail: this.msg.components.compta.messageDeleteError
                });
                this.loadingService.hide();
                return;
            }

            this.comptaService.delete(this.compta.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });

                    this.checkIfListIsNull();
                    this.listCompta = this.updateList(initObjectCompta(), this.listCompta, OperationType.DELETE, id);
                    this.compta = initObjectCompta();
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
