import { Absence, initObjectAbsence } from '@/models/absence';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { AbsenceService } from '@/services/absence/absence-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { OperationType } from '@/shared/enums/operation-type';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { arrayToMap, getElementFromMap, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { MultiSelectModule } from 'primeng/multiselect';
import { AbsencelValidator } from '@/validators/absence-validator';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { CheckboxModule } from 'primeng/checkbox';
import { StateService } from '@/state/state-service';
import { CommonSearchModel, initCommonSearchModel } from '@/search/common-search-model';

@Component({
    selector: 'app-absence-component',
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
        InputTextModule,
        DatePickerModule,
        SelectModule,
        IconFieldModule,
        ToggleSwitchModule,
        CheckboxModule,
        MultiSelectModule
    ],
    templateUrl: './absence-component.html',
    styleUrl: './absence-component.scss'
})
export class AbsenceComponent implements OnInit {
    //Buttons ---> Ajouter + Rechercher + Actualiser + Consulter
    //Tableau ---> Date + Personnel + Matin + Soir
    //Ajouter ---> Date + Personnel + Matin + Soir
    dateDebut: Date | null = null;
    dateFin: Date | null = null;
    personnelIdImprimer: bigint | null = null;
    personnelCreationId: number | null = null;
    listPersonnelFixe: Personnel[] = [];
    listPersonnel: Personnel[] = [];
    listAbsence: Absence[] = [];
    absence: Absence = initObjectAbsence();
    selectedAbsence!: Absence;
    mapOfPersonnels: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    dialogImprimer: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;

    constructor(
        private personnelService: PersonnelService,
        private absenceService: AbsenceService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.getAllAbsence();
        this.getAllPersonnelFixe();
        this.initFormGroup();
    }

    sortList(listAbsence: Absence[]): Absence[] {
        return listAbsence.sort((a, b) => b.dateAbsence.getTime() - a.dateAbsence.getTime());
    }

    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                personnelId: [0, [Validators.required, Validators.min(1)]],
                dateAbsence: [new Date(), Validators.required],
                matin: [false],
                apresMidi: [false]
            },
            { validators: AbsencelValidator }
        );
    }

    getAllAbsence(): void {
        this.absenceService.getAll().subscribe({
            next: (data: Absence[]) => {
                this.listAbsence = (data || []).map((a) => {
                    const dateAbsence = new Date(a.dateAbsence);
                    return {
                        ...a,
                        dateAbsence: dateAbsence,
                        dateAbsenceStr: this.formatDate(dateAbsence)
                    };
                });
                this.listAbsence = this.sortList(this.listAbsence);
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getAllPersonnelFixe(): void {
        let personnel: Personnel = initObjectPersonnel();
        this.personnelService.getAllExceptAdmin(personnel).subscribe({
            next: (data: Personnel[]) => {
                this.listPersonnelFixe = data;
                this.mapOfPersonnels = arrayToMap(this.listPersonnelFixe, 'id', ['designation'], ['']);
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getDesignationPersonnel(id: number): string {
        return getElementFromMap(this.mapOfPersonnels, id);
    }

    openCloseDialogAjouter(openClose: boolean): void {
        this.dialogAjouter = openClose;
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    openCloseDialogImprimer(openClose: boolean): void {
        this.dialogImprimer = openClose;
    }

    viderConsulter() {
        this.dateDebut = null;
        this.dateFin = null;
        this.personnelIdImprimer = BigInt(0);
        this.openCloseDialogImprimer(true);
    }

    viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.absence = initObjectAbsence();
        this.initFormGroup();
        this.onChangeDateAbsence();
    }

    async getPersonnelPresent(absence: Absence): Promise<Personnel[]> {
        try {
            let absenceToSend: Absence = structuredClone(absence);
            absenceToSend.dateAbsence = mapToDateTimeBackEnd(absence.dateAbsence);

            const existsObservable = this.personnelService.present(absenceToSend).pipe(
                catchError((error) => {
                    console.error('Error in absence existence observable:', error);
                    return of([]); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if absence exists:', error);
            return [];
        }
    }

    async onChangeDateAbsence() {
        let dateAbsence: Date = this.formGroup.get('dateAbsence')?.value ?? new Date();
        this.absence.dateAbsence = dateAbsence;
        this.listPersonnel = await this.getPersonnelPresent(this.absence);
        this.formGroup.patchValue({
            personnelId: 0
        });
    }

    onClearDateAbsence(): void {
        this.listPersonnel = [];
        this.formGroup.patchValue({
            personnelId: 0
        });
    }

    async recupperer(operation: number, absenceEdit: Absence) {
        if (absenceEdit && absenceEdit.id) {
            this.absence = absenceEdit;
            if (operation === 1) {
                this.formGroup.patchValue({
                    personnelId: this.absence.personnelId,
                    dateAbsence: new Date(this.absence.dateAbsence) ?? new Date(),
                    matin: this.absence.matin,
                    apresMidi: this.absence.apresMidi
                });

                this.listPersonnel = await this.getPersonnelPresent(this.absence);

                this.openCloseDialogAjouter(true);
            } else {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(absence: Absence, list: Absence[], operationType: OperationType, id?: bigint): Absence[] {
        if (absence && absence.dateAbsence) {
            absence.dateAbsence = new Date(absence.dateAbsence);
            absence.dateAbsenceStr = this.formatDate(absence.dateAbsence);
        }
        if (operationType === OperationType.ADD) {
            list = [...list, absence];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === absence.id);
            if (index > -1) {
                list[index] = absence;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }
        list = this.sortList(list);
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listAbsence) {
            this.listAbsence = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, absence: Absence): Absence {
        absence.dateAbsence = formGroup.get('dateAbsence')?.value;
        absence.dateAbsence = mapToDateTimeBackEnd(absence.dateAbsence);
        absence.personnelId = formGroup.get('personnelId')?.value;
        absence.matin = formGroup.get('matin')?.value;
        absence.apresMidi = formGroup.get('apresMidi')?.value;

        return absence;
    }

    async checkIfExists(absence: Absence): Promise<boolean> {
        try {
            const existsObservable = this.absenceService.exist(absence).pipe(
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

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let absenceEdit: Absence = { ...this.absence };
        this.mapFormGroupToObject(this.formGroup, absenceEdit);
        let trvErreur = await this.checkIfExists(absenceEdit);

        if (!trvErreur) {
            this.absence = this.mapFormGroupToObject(this.formGroup, this.absence);
            this.submitted = true;

            if (this.absence.id) {
                this.absenceService.update(this.absence.id, this.absence).subscribe({
                    next: (data) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });
                        this.checkIfListIsNull();
                        this.listAbsence = this.updateList(data, this.listAbsence, OperationType.MODIFY);
                        this.openCloseDialogAjouter(false);
                        console.log('Close dialog Ajouter');
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
                this.absence.personnelOperationId = BigInt(this.personnelCreationId || 0);
                this.absenceService.create(this.absence).subscribe({
                    next: (data: Absence) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });
                        this.checkIfListIsNull();
                        this.listAbsence = this.updateList(data, this.listAbsence, OperationType.ADD);
                        this.openCloseDialogAjouter(false);
                        console.log('Close dialog Ajouter');
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
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.absence.label} ${this.msg.messages.messageExistDeja}` });
            this.loadingService.hide();
        }
    }

    supprimer(): void {
        if (this.absence && this.absence.id) {
            this.loadingService.show();
            let id = this.absence.id;
            this.absenceService.delete(this.absence.id).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageDeleteSuccess });
                    this.checkIfListIsNull();
                    this.listAbsence = this.updateList(initObjectAbsence(), this.listAbsence, OperationType.DELETE, id);
                    this.absence = initObjectAbsence();
                },
                error: (err) => {
                    console.log(err);
                    this.loadingService.hide();
                    this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
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

    formatDate(date: Date): string {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    imprimer(): void {
        this.loadingService.show();

        let commonSearchModel: CommonSearchModel = initCommonSearchModel();
        commonSearchModel.searchByDate = true;
        commonSearchModel.personnelId = this.personnelIdImprimer;
        commonSearchModel.dateDebut = this.dateDebut ? new Date(this.dateDebut) : null;
        commonSearchModel.dateFin = this.dateFin ? new Date(this.dateFin) : null;

        this.absenceService.imprimer(commonSearchModel).subscribe({
            next: (data) => {
                const file = new Blob([data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                var a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.click();
            },
            error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageErrorProduite });
            },
            complete: () => {
                this.loadingService.hide();
            }
        });
    }
}
