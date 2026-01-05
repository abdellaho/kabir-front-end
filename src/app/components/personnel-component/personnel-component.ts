import { PersonnelService } from '@/services/personnel/personnel-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypePersonnel, filteredTypePersonnelAll, TypePersonnel } from '@/shared/enums/type-personnel';
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
import { CheckboxModule } from 'primeng/checkbox';

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
        CheckboxModule,
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
    selectedPersonnel!: Personnel;
    listPersonnel: Personnel[] = [];
    typePersonnel: { label: string, value: TypePersonnel }[] = filteredTypePersonnelAll;
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    dialogArchiver: boolean = false;
    dialogCorbeille: boolean = false;
    dialogAnnulerArchiver: boolean = false;
    dialogAnnulerCorbeille: boolean = false;
    dialogRole: boolean = false;
    submitted: boolean = false;
    loading: boolean = true;
    formGroup!: FormGroup;
    formGroupRole!: FormGroup;
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
        this.initFormGroupRole();
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

    openCloseDialogRole(openClose: boolean): void {
        this.dialogRole = openClose;
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group({
            designation: ['', [Validators.required, Validators.min(1)]],
            cin: ['', [Validators.required, Validators.min(1)]],
            email: ['', [Validators.email]],
            password: [''],
            typePersonnel: [0, [Validators.required, Validators.min(1)]],
            dateEntrer: [new Date()],
            tel1: [''],
            tel2: [''],
            adresse: [''],
            salaire: [null],
            etatComptePersonnel: [true]
        }, { validators: [ PersonnelValidator ] });
    }

    initFormGroupRole() {
        this.formGroupRole = this.formBuilder.group({
            consulterStock: [false],
            ajouterStock: [false],
            modifierStock: [false],
            supprimerStock: [false],
            consulterRepertoire: [false],
            ajouterRepertoire: [false],
            modifierRepertoire: [false],
            supprimerRepertoire: [false],
        });
    }

    viderAjouter() {
        this.typePersonnel = filteredTypePersonnelAll;
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.personnel = initObjectPersonnel();
        this.initFormGroup();
    }

    recupperer(operation: number, personnelEdit: Personnel) {
        if (personnelEdit && personnelEdit.id) {
            this.personnel = personnelEdit;
            if (operation === 1) {
                if(this.personnel.typePersonnel === 1) {
                    this.typePersonnel = filteredTypePersonnel;
                } else{
                    this.typePersonnel = filteredTypePersonnelAll;
                }

                this.formGroup.patchValue({
                    designation: this.personnel.designation,
                    cin: this.personnel.cin,
                    email: this.personnel.email,
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
            } else if (operation === 2) {
                this.openCloseDialogSupprimer(true);
            } else if (operation === 3) {
                this.openCloseDialogArchiver(true);
            } else if (operation === 4) {
                this.openCloseDialogCorbeille(true);
            } else if (operation === 5) {
                this.openCloseDialogAnnulerArchiver(true);
            } else if (operation === 6) {
                this.openCloseDialogAnnulerCorbeille(true);
            } else if (operation === 7) {
                this.initFormGroupRole();
                this.formGroupRole.patchValue({
                    consulterStock: this.personnel.consulterStock ?? false,
                    ajouterStock: this.personnel.ajouterStock ?? false,
                    modifierStock: this.personnel.modifierStock ?? false,
                    supprimerStock: this.personnel.supprimerStock ?? false,
                    consulterRepertoire: this.personnel.consulterRepertoire ?? false,
                    ajouterRepertoire: this.personnel.ajouterRepertoire ?? false,
                    modifierRepertoire: this.personnel.modifierRepertoire ?? false,
                    supprimerRepertoire: this.personnel.supprimerRepertoire ?? false,
                });
                this.openCloseDialogRole(true);
            }
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

    mapFormGroupToObject(formGroup: FormGroup, personnel: Personnel, type: number): Personnel {
        if(type === 0){
            personnel.designation = formGroup.get('designation')?.value;
            personnel.cin = formGroup.get('cin')?.value;
            personnel.email = formGroup.get('email')?.value;
            personnel.login = formGroup.get('email')?.value;
            personnel.passwordFake = formGroup.get('password')?.value;
            personnel.typePersonnel = formGroup.get('typePersonnel')?.value;
            personnel.dateEntrer = formGroup.get('dateEntrer')?.value;
            personnel.tel1 = formGroup.get('tel1')?.value;
            personnel.tel2 = formGroup.get('tel2')?.value;
            personnel.adresse = formGroup.get('adresse')?.value;
            personnel.salaire = formGroup.get('salaire')?.value ?? 0;
            personnel.etatComptePersonnel = formGroup.get('etatComptePersonnel')?.value;
        } else {
            personnel.consulterRepertoire = formGroup.get('consulterRepertoire')?.value ?? false;
            personnel.ajouterRepertoire = formGroup.get('ajouterRepertoire')?.value ?? false;
            personnel.modifierRepertoire = formGroup.get('modifierRepertoire')?.value ?? false;
            personnel.supprimerRepertoire = formGroup.get('supprimerRepertoire')?.value ?? false;
            
            personnel.consulterStock = formGroup.get('consulterStock')?.value ?? false;
            personnel.ajouterStock = formGroup.get('ajouterStock')?.value ?? false;
            personnel.modifierStock = formGroup.get('modifierStock')?.value ?? false;
            personnel.supprimerStock = formGroup.get('supprimerStock')?.value ?? false;
        }
        

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

    checkEmailAndPassword(autoriser: boolean): boolean {
        if((this.formGroup.get('email')?.value !== null && this.formGroup.get('email')?.value.trim() !== '') 
            && ((this.formGroup.get('motDePasse')?.value === null || this.formGroup.get('motDePasse')?.value.trim() === '') && (this.personnel.password === null || this.personnel.password.trim() === ''))){
            autoriser = false;
            this.messageService.add({
                severity: 'error',
                summary: this.msg.summary.labelError,
                detail: this.msg.components.personnel.motDePasseRequired,
                life: 3000
            });
            return autoriser;
        }

        if(this.formGroup.get('motDePasse')?.value !== null && this.formGroup.get('motDePasse')?.value.trim() !== '' && (this.formGroup.get('email')?.value === null || this.formGroup.get('email')?.value.trim() === '')){
            autoriser = false;
            this.messageService.add({
                severity: 'error',
                summary: this.msg.summary.labelError,
                detail: this.msg.components.personnel.emailRequired,
                life: 3000
            });
            return autoriser;
        }

        return autoriser;
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let personnelEdit: Personnel = { ...this.personnel };
        let autoriser: boolean = true;
        autoriser = this.checkEmailAndPassword(autoriser);
        if (!autoriser) {
            this.loadingService.hide();
            return;
        }
        personnelEdit = this.mapFormGroupToObject(this.formGroup, personnelEdit, 0);
        //let personnelSearch: PersonnelSearch = { ...personnelEdit, id: this.personnel.id };
        let trvErreur = await this.checkIfExists(personnelEdit);

        if (!trvErreur) {
            this.personnel = this.mapFormGroupToObject(this.formGroup, this.personnel, 0);
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
            
            if(corbeille) {
                this.personnel.dateSuppression = new Date();
            } else {
                this.personnel.dateSuppression = null;
            }

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

    updateRole() {
        if (this.personnel && this.personnel.id) {
            this.loadingService.show();
            let id = this.personnel.id;
            this.personnel = this.mapFormGroupToObject(this.formGroupRole, this.personnel, 1);

            this.personnelService.update(id, this.personnel).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listPersonnel = this.updateList(data, this.listPersonnel, OperationType.MODIFY, id);
                    this.personnel = initObjectPersonnel();
                    this.openCloseDialogRole(false);
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
    }

    onChangeRoleConsulter(event: any, type: number) {
        switch (type) {
            case 1:
                this.personnel.consulterStock = this.formGroupRole.get('consulterStock')?.value;
                if (this.personnel.consulterStock === false) {
                    this.formGroupRole.patchValue({
                        ajouterStock: false,
                        modifierStock: false,
                        supprimerStock: false
                    });
                }
                break;
            case 2:
                this.personnel.consulterRepertoire = this.formGroupRole.get('consulterRepertoire')?.value;
                if (this.personnel.consulterRepertoire === false) {
                    this.formGroupRole.patchValue({
                        ajouterRepertoire: false,
                        modifierRepertoire: false,
                        supprimerRepertoire: false
                    });
                }
                break;
        }
    }

    onChangeRoleAjouter(event: any, type: number) {
        switch (type) {
            case 1:
                if (this.formGroupRole.get('consulterStock')?.value === false) {
                    this.formGroupRole.patchValue({
                        ajouterStock: false,
                    });
                }
                break;
            case 2:
                if (this.formGroupRole.get('consulterRepertoire')?.value === false) {
                    this.formGroupRole.patchValue({
                        ajouterRepertoire: false,
                    });
                }
                break;
        }
    }

    onChangeRoleModifier(event: any, type: number) {
        switch (type) {
            case 1:
                if (this.formGroupRole.get('consulterStock')?.value === false) {
                    this.formGroupRole.patchValue({
                        modifierStock: false,
                    });
                }
                break;
            case 2:
                if (this.formGroupRole.get('consulterRepertoire')?.value === false) {
                    this.formGroupRole.patchValue({
                        modifierRepertoire: false,
                    });
                }
                break;
        }
    }

    onChangeRoleSupprimer(event: any, type: number) {
        switch (type) {
            case 1:
                if (this.formGroupRole.get('consulterStock')?.value === false) {
                    this.formGroupRole.patchValue({
                        supprimerStock: false
                    });
                }
                break;
            case 2:
                if (this.formGroupRole.get('consulterRepertoire')?.value === false) {
                    this.formGroupRole.patchValue({
                        supprimerRepertoire: false
                    });
                }
                break;
        }
    }

}
