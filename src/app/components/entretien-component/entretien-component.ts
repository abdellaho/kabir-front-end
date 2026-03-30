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
import { arrayToMap, mapToDateTimeBackEnd } from '@/shared/classes/generic-methods';
import { MultiSelectModule } from 'primeng/multiselect';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { CheckboxModule } from 'primeng/checkbox';
import { StateService } from '@/state/state-service';
import { CommonSearchModel, initCommonSearchModel } from '@/search/common-search-model';
import { initObjectVoiture, Voiture } from '@/models/voiture';
import { Entretien, initObjectEntretien } from '@/models/entretien';
import { EntretienService } from '@/services/entretien/entretien-service';
import { VoitureService } from '@/services/voiture/voiture-service';
import { EntretienValidator } from '@/validators/entretien-validator';

@Component({
    selector: 'app-entretien-component',
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
    templateUrl: './entretien-component.html',
    styleUrl: './entretien-component.scss'
})
export class EntretienComponent implements OnInit {
    personnelCreationId: number | null = null;
    listVoiture: Voiture[] = [];
    listEntretien: Entretien[] = [];
    listEntretienFixe: Entretien[] = [];
    entretien: Entretien = initObjectEntretien();
    selectedEntretien!: Entretien;
    mapOfVoitures: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    msg = APP_MESSAGES;

    constructor(
        private entretienService: EntretienService,
        private voitureService: VoitureService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.personnelCreationId = this.stateService.getState().user?.id || null;
        this.getAllEntretien();
        this.getAllVoiture();
        this.initFormGroup();
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
                voitureId: [0, [Validators.required, Validators.min(1)]],
                voitureKmMax: [{ value: 0, disabled: true }],
                dateEntretien: [new Date(), Validators.required],
                kmDetecte: [0, Validators.required],
                huile: [false],
                filtreHuile: [false],
                filtreCarburant: [false],
                filtreAir: [false],
                plaquetteAV: [false],
                plaquetteAR: [false],
                pneuAV: [false],
                pneuAR: [false],
                kitDistribution: [false],
                batterie: [false]
            },
            { validators: EntretienValidator }
        );
    }

    onChangeVoitureId() {
        let kmMax: number = 0;
        if (this.formGroup.get('voitureId')?.value !== null && this.formGroup.get('voitureId')?.value !== undefined && this.formGroup.get('voitureId')?.value !== BigInt(0)) {
            let voiture = this.listVoiture.find((x) => x.id === this.formGroup.get('voitureId')?.value);
            if (voiture && voiture.id) {
                kmMax = voiture.kmMax;
            }
        }

        this.formGroup.patchValue({
            voitureKmMax: kmMax
        });

        this.formGroup.get('voitureKmMax')?.disable();
    }

    getAllEntretien(): void {
        let commonSearchModel: CommonSearchModel = initCommonSearchModel();
        commonSearchModel.searchByDate = true;

        this.entretienService.getAll().subscribe({
            next: (data: Entretien[]) => {
                this.listEntretienFixe = data;
                this.listEntretien = this.listEntretienFixe;
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getAllVoiture(): void {
        this.voitureService.getAll().subscribe({
            next: (data: Voiture[]) => {
                const emptyVoiture = initObjectVoiture();
                emptyVoiture.id = BigInt(0);
                this.listVoiture = [emptyVoiture, ...data];
                this.mapOfVoitures = arrayToMap(this.listVoiture, 'id', ['numVoiture'], ['']);
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
        this.entretien = initObjectEntretien();
        this.initFormGroup();
    }

    async checkIfExists(entretien: Entretien): Promise<boolean> {
        try {
            let entretienToSend: Entretien = structuredClone(entretien);
            entretienToSend.dateEntretien = mapToDateTimeBackEnd(entretien.dateEntretien);

            const existsObservable = this.entretienService.exist(entretienToSend).pipe(
                catchError((error) => {
                    console.error('Error in entretien existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if entretien exists:', error);
            return false;
        }
    }

    async recupperer(operation: number, entretienEdit: Entretien) {
        if (entretienEdit && entretienEdit.id) {
            this.entretien = entretienEdit;
            if (operation === 1) {
                this.formGroup.patchValue({
                    voitureId: this.entretien.voitureId,
                    voitureKmMax: this.entretien.voitureKmMax,
                    dateEntretien: new Date(this.entretien.dateEntretien) ?? new Date(),
                    kmDetecte: this.entretien.kmDetecte,
                    huile: this.entretien.huile,
                    filtreHuile: this.entretien.filtreHuile,
                    filtreCarburant: this.entretien.filtreCarburant,
                    filtreAir: this.entretien.filtreAir,
                    plaquetteAV: this.entretien.plaquetteAV,
                    plaquetteAR: this.entretien.plaquetteAR,
                    pneuAV: this.entretien.pneuAV,
                    pneuAR: this.entretien.pneuAR,
                    kitDistribution: this.entretien.kitDistribution,
                    batterie: this.entretien.batterie
                });

                this.openCloseDialogAjouter(true);
            } else {
                this.openCloseDialogSupprimer(true);
            }
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(entretien: Entretien, list: Entretien[], operationType: OperationType, id?: bigint): Entretien[] {
        if (operationType === OperationType.ADD) {
            list = [...list, entretien];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex((x) => x.id === entretien.id);
            if (index > -1) {
                list[index] = entretien;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter((x) => x.id !== id);
        }

        list = this.sortList(list);

        return list;
    }

    sortList(listEntretien: Entretien[]): Entretien[] {
        return listEntretien.sort((a, b) => {
            let x = new Date(a.dateEntretien).getTime();
            let y = new Date(b.dateEntretien).getTime();
            if (x > y) {
                return -1;
            } else if (x < y) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    checkIfListIsNull() {
        if (null == this.listEntretien) {
            this.listEntretien = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, entretien: Entretien): Entretien {
        entretien.dateEntretien = formGroup.get('dateEntretien')?.value;
        entretien.dateEntretien = mapToDateTimeBackEnd(entretien.dateEntretien);
        entretien.voitureId = formGroup.get('voitureId')?.value;
        entretien.kmDetecte = formGroup.get('kmDetecte')?.value;
        entretien.huile = formGroup.get('huile')?.value;
        entretien.filtreHuile = formGroup.get('filtreHuile')?.value;
        entretien.filtreCarburant = formGroup.get('filtreCarburant')?.value;
        entretien.filtreAir = formGroup.get('filtreAir')?.value;
        entretien.plaquetteAV = formGroup.get('plaquetteAV')?.value;
        entretien.plaquetteAR = formGroup.get('plaquetteAR')?.value;
        entretien.pneuAV = formGroup.get('pneuAV')?.value;
        entretien.pneuAR = formGroup.get('pneuAR')?.value;
        entretien.kitDistribution = formGroup.get('kitDistribution')?.value;
        entretien.batterie = formGroup.get('batterie')?.value;

        return entretien;
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let entretienEdit: Entretien = { ...this.entretien };
        this.mapFormGroupToObject(this.formGroup, entretienEdit);
        let trvErreur = false;// await this.checkIfExists(entretienEdit);

        if (!trvErreur) {
            this.entretien = this.mapFormGroupToObject(this.formGroup, this.entretien);
            this.submitted = true;

            if (this.entretien.id) {
                this.entretienService.update(this.entretien.id, this.entretien).subscribe({
                    next: (data) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });
                        this.checkIfListIsNull();
                        this.listEntretien = this.updateList(data, this.listEntretien, OperationType.MODIFY);
                        this.openCloseDialogAjouter(false);
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
                //this.entretien.personnelOperationId = BigInt(this.personnelCreationId || 0);
                this.entretien.kmMax = this.formGroup.get('voitureKmMax')?.value || 0;
                this.entretienService.create(this.entretien).subscribe({
                    next: (data: Entretien) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });
                        this.checkIfListIsNull();
                        this.listEntretien = this.updateList(data, this.listEntretien, OperationType.ADD);
                        this.openCloseDialogAjouter(false);
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
        } else {
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.entretien.errors.messageExist}`, sticky: true });
            this.loadingService.hide();
        }
    }

    supprimer(): void {
        if (this.entretien && this.entretien.id) {
            this.loadingService.show();
            let id = this.entretien.id;
            this.entretienService.delete(this.entretien.id).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageDeleteSuccess });
                    this.checkIfListIsNull();
                    this.listEntretien = this.updateList(initObjectEntretien(), this.listEntretien, OperationType.DELETE, id);
                    this.entretien = initObjectEntretien();
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

    imprimer(entretien: Entretien): void {
        this.loadingService.show();
        this.entretienService.imprimer(entretien).subscribe({
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
