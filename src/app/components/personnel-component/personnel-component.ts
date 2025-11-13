import { PersonnelService } from '@/services/personnel/personnel-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypePersonnelAll, TypePersonnel } from '@/shared/enums/type-personnel';
import { LoadingService } from '@/shared/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { TypePersonnelPipe } from '@/pipes/type-personnel-pipe';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PersonnelValidator } from '@/validators/personnel-validator';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-personnel-component',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        PasswordModule,
        DatePickerModule,
        InputNumberModule,
        ToggleButtonModule,
        FloatLabelModule,
        SelectModule,
        ToggleSwitchModule,
        MessageModule,
        TypePersonnelPipe
    ],
    templateUrl: './personnel-component.html',
    styleUrl: './personnel-component.scss'
})
export class PersonnelComponent implements OnInit {

    personnel: Personnel = initObjectPersonnel();
    listPersonnel: Personnel[] = [];
    typePersonnel: { label: string, value: TypePersonnel }[] = filteredTypePersonnelAll;
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    dialogArchiver: boolean = false;
    dialogCorbeille: boolean = false;
    dialogAnnulerArchiver: boolean = false;
    dialogAnnulerCorbeille: boolean = false;
    submitted: boolean = false;
    loading: boolean = true;
    formGroup!: FormGroup;
    typeOfList: number = 0;
    msg = APP_MESSAGES;

    constructor(
        private personnelService: PersonnelService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit(): void {
        this.typeOfList = 0;
        this.search();
        this.initFormGroup();
    }

    archiveListe(): void {
        this.typeOfList = 1;
        this.search();
    }

    corbeilleListe(): void {
        this.typeOfList = 2;
        this.search();
    }

    listOfAll(): void {
        this.typeOfList = 0;
        this.search();
    }

    search() {
        if (this.typeOfList === 1) {
            this.getAllArchive();
        } else if (this.typeOfList === 2) {
            this.getAllCorbeille();
        } else {
            this.getAll();
        }
    }

    initObjectSearch(archiver: boolean, supprimer: boolean): Personnel {
        let objectSearch: Personnel = initObjectPersonnel();

        objectSearch.archiver = archiver;
        objectSearch.supprimer = supprimer;

        return objectSearch;
    }

    getAll(): void {
        let objectSearch: Personnel = this.initObjectSearch(false, false);
        this.personnelService.search(objectSearch).subscribe({
            next: (data: Personnel[]) => {
                this.listPersonnel = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllArchive(): void {
        let objectSearch: Personnel = this.initObjectSearch(true, false);

        this.personnelService.search(objectSearch).subscribe({
            next: (data: Personnel[]) => {
                this.listPersonnel = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllCorbeille(): void {
        let objectSearch: Personnel = this.initObjectSearch(false, true);

        this.personnelService.search(objectSearch).subscribe({
            next: (data: Personnel[]) => {
                this.listPersonnel = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openCloseDialogAjouter(openClose: boolean): void {
        this.dialogAjouter = openClose;
    }

    openCloseDialogSupprimer(openClose: boolean): void {
        this.dialogSupprimer = openClose;
    }

    openCloseDialogArchiver(openClose: boolean): void {
        this.dialogArchiver = openClose;
    }

    openCloseDialogCorbeille(openClose: boolean): void {
        this.dialogCorbeille = openClose;
    }

    openCloseDialogAnnulerArchiver(openClose: boolean): void {
        this.dialogAnnulerArchiver = openClose;
    }

    openCloseDialogAnnulerCorbeille(openClose: boolean): void {
        this.dialogAnnulerCorbeille = openClose;
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group({
            designation: ['', [Validators.required, Validators.min(1)]],
            cin: ['', [Validators.required, Validators.min(1)]],
            login: [''],
            password: [''],
            typePersonnel: [0],
            dateEntrer: [new Date()],
            tel1: [''],
            tel2: [''],
            adresse: [''],
            salaire: [null],
            etatComptePersonnel: [true]
        }, { validators: [PersonnelValidator] });
    }

    viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.personnel = initObjectPersonnel();
        this.initFormGroup();
    }

    recupperer(operation: number, personnelEdit: Personnel) {
        if (personnelEdit && personnelEdit.id) {
            this.personnel = personnelEdit;
            if (operation === 1) {
                this.formGroup.patchValue({
                    designation: this.personnel.designation,
                    cin: this.personnel.cin,
                    login: this.personnel.login,
                    password: '', //this.personnel.password,
                    typePersonnel: this.personnel.typePersonnel,
                    dateEntrer: this.personnel?.dateEntrer ? new Date(this.personnel.dateEntrer) : new Date(),
                    tel1: this.personnel.tel1,
                    tel2: this.personnel.tel2,
                    adresse: this.personnel.adresse,
                    salaire: this.personnel.salaire !== 0 ? this.personnel.salaire : null,
                    etatComptePersonnel: this.personnel.etatComptePersonnel
                });

                this.openCloseDialogAjouter(true);
            } else if(operation === 2) {
                this.openCloseDialogSupprimer(true);
            } else if (operation === 3) {
                this.openCloseDialogArchiver(true);
            } else if (operation === 4) {
                this.openCloseDialogCorbeille(true);
            } else if (operation === 5) {
                this.openCloseDialogAnnulerArchiver(true);
            } else if (operation === 6) {
                this.openCloseDialogAnnulerCorbeille(true);
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: this.msg.summary.labelError,
                detail: this.msg.messages.messageError
            });
        }
    }

    updateList(personnel: Personnel, list: Personnel[], operationType: OperationType, id?: bigint): Personnel[] {
        if (operationType === OperationType.ADD) {
            list = [...list, personnel];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex(x => x.id === personnel.id);
            if (index > -1) {
                list[index] = personnel;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter(x => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listPersonnel) {
            this.listPersonnel = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, personnel: Personnel): Personnel {
        personnel.designation = formGroup.get('designation')?.value;
        personnel.cin = formGroup.get('cin')?.value;
        personnel.login = formGroup.get('login')?.value;
        personnel.password = formGroup.get('password')?.value;
        personnel.typePersonnel = formGroup.get('typePersonnel')?.value;
        personnel.dateEntrer = formGroup.get('dateEntrer')?.value;
        personnel.tel1 = formGroup.get('tel1')?.value;
        personnel.tel2 = formGroup.get('tel2')?.value;
        personnel.adresse = formGroup.get('adresse')?.value;
        personnel.salaire = formGroup.get('salaire')?.value | 0;
        personnel.etatComptePersonnel = formGroup.get('etatComptePersonnel')?.value;

        return personnel;
    }

    async checkIfExists(personnel: Personnel): Promise<boolean> {
        try {
            const existsObservable = this.personnelService.exist(personnel).pipe(
                catchError(error => {
                    console.error('Error in personnel existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if personnel exists:', error);
            return false;
        }
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let personnelEdit: Personnel = { ...this.personnel };
        personnelEdit = this.mapFormGroupToObject(this.formGroup, personnelEdit);
        //let personnelSearch: PersonnelSearch = { ...personnelEdit, id: this.personnel.id };
        let trvErreur = await this.checkIfExists(personnelEdit);

        if (!trvErreur) {
            this.personnel = this.mapFormGroupToObject(this.formGroup, this.personnel);
            this.submitted = true;

            if (this.personnel.id) {
                this.personnelService.update(this.personnel.id, this.personnel).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });
                        this.checkIfListIsNull();
                        this.listPersonnel = this.updateList(data, this.listPersonnel, OperationType.MODIFY);
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
                this.personnelService.create(this.personnel).subscribe({
                    next: (data: Personnel) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });
                        this.checkIfListIsNull();
                        this.listPersonnel = this.updateList(data, this.listPersonnel, OperationType.ADD);
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
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.personnel.label} ${this.msg.messages.messageExistDeja}` });
            this.loadingService.hide();
        }
    }

    supprimer(): void {
        if (this.personnel && this.personnel.id) {
            this.loadingService.show();
            let id = this.personnel.id;
            this.personnelService.delete(this.personnel.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });
                    this.checkIfListIsNull();
                    this.listPersonnel = this.updateList(initObjectPersonnel(), this.listPersonnel, OperationType.DELETE, id);
                    this.personnel = initObjectPersonnel();
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

    archiver(archiver: boolean): void {
        if (this.personnel && this.personnel.id) {
            this.loadingService.show();
            let id = this.personnel.id;
            this.personnel.archiver = archiver;

            this.personnelService.update(this.personnel.id, this.personnel).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listPersonnel = this.updateList(initObjectPersonnel(), this.listPersonnel, OperationType.DELETE, id);
                    this.personnel = initObjectPersonnel();
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

        if (archiver) {
            this.openCloseDialogArchiver(false);
        } else {
            this.openCloseDialogAnnulerArchiver(false);
        }
    }

    corbeille(corbeille: boolean): void {
        if (this.personnel && this.personnel.id) {
            this.loadingService.show();
            let id = this.personnel.id;
            this.personnel.supprimer = corbeille;

            this.personnelService.update(this.personnel.id, this.personnel).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listPersonnel = this.updateList(initObjectPersonnel(), this.listPersonnel, OperationType.DELETE, id);
                    this.personnel = initObjectPersonnel();
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

        if (corbeille) {
            this.openCloseDialogCorbeille(false);
        } else {
            this.openCloseDialogAnnulerCorbeille(false);
        }
    }

}
