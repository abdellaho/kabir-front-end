import { Fournisseur, initObjectFournisseur } from '@/models/fournisseur';
import { Ville } from '@/models/ville';
import { TypeFournisseurPipe } from '@/pipes/type-fournisseur-pipe';
import { FournisseurService } from '@/services/fournisseur/fournisseur-service';
import { VilleService } from '@/services/ville/ville-service';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypeFourniseur } from '@/shared/enums/type-fournisseur';
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
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, firstValueFrom, of } from 'rxjs';
import { Ripple } from 'primeng/ripple';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { FournisseurValidator } from '@/validators/fournisseur-validator';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-fournisseur-component',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        ToolbarModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ButtonModule,
        DialogModule,
        FloatLabelModule,
        InputNumberModule,
        SelectModule,
        MessageModule,
        TypeFournisseurPipe,
        Ripple
    ],
    templateUrl: './fournisseur-component.html',
    styleUrl: './fournisseur-component.scss'
})
export class FournisseurComponent implements OnInit {

    //Buttons ---> Ajouter + Rechercher + Actualiser + Archiver + Corbeille
    //Tableau ---> Designation + Type + Tel1 + Tel2
    //Ajouter ---> Designation* + Type + Tel1 + Tel2  + ICE

    types: any = [
        { key: 'Marchandises', value: 0 },
        { key: 'Services', value: 1 },
        { key: 'Douanes', value: 2 },
        { key: 'Carburant', value: 3 },
        { key: 'Fourniture', value: 4 }
    ];

    typeFournisseurs: { label: string, value: number }[] = filteredTypeFourniseur;
    listVille: Ville[] = [];
    listFournisseur: Fournisseur[] = [];
    fournisseur: Fournisseur = initObjectFournisseur();
    mapOfPersonnels: Map<number, string> = new Map<number, string>();
    dialogSupprimer: boolean = false;
    dialogAjouter: boolean = false;
    dialogArchiver: boolean = false;
    dialogCorbeille: boolean = false;
    dialogAnnulerArchiver: boolean = false;
    dialogAnnulerCorbeille: boolean = false;
    submitted: boolean = false;
    formGroup!: FormGroup;
    typeOfList: number = 0;
    msg = APP_MESSAGES;

    constructor(
        private villeService: VilleService,
        private fournisseurService: FournisseurService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit(): void {
        this.typeOfList = 0;
        this.search();
        this.getAllVille();
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

    initObjectSearch(archiver: boolean, supprimer: boolean): Fournisseur {
        let objectSearch: Fournisseur = initObjectFournisseur();

        objectSearch.archiver = archiver;
        objectSearch.supprimer = supprimer;

        return objectSearch;
    }

    getAll(): void {
        let objectSearch: Fournisseur = this.initObjectSearch(false, false);

        this.fournisseurService.search(objectSearch).subscribe({
            next: (data: Fournisseur[]) => {
                this.listFournisseur = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllArchive(): void {
        let objectSearch: Fournisseur = this.initObjectSearch(true, false);

        this.fournisseurService.search(objectSearch).subscribe({
            next: (data: Fournisseur[]) => {
                this.listFournisseur = data;
            }, error: (error: any) => {
                console.error(error);
            }, complete: () => {
                this.loadingService.hide();
            }
        });
    }

    getAllCorbeille(): void {
        let objectSearch: Fournisseur = this.initObjectSearch(false, true);

        this.fournisseurService.search(objectSearch).subscribe({
            next: (data: Fournisseur[]) => {
                this.listFournisseur = data;
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

    initFormGroup() {
        this.formGroup = this.formBuilder.group({
            designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            type: [0],
            tel1: [''],
            tel2: [''],
            ice: [''],
            adresse: [''],
        }, { validators: [FournisseurValidator] });
    }

    getAllVille(): void {
        this.villeService.getVilles().subscribe({
            next: (data: Ville[]) => {
                this.listVille = data;
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

    viderAjouter() {
        this.openCloseDialogAjouter(true);
        this.submitted = false;
        this.fournisseur = initObjectFournisseur();
        this.initFormGroup();
    }

    recupperer(operation: number, paysEdit: Fournisseur) {
        if (paysEdit && paysEdit.id) {
            this.fournisseur = paysEdit;
            if (operation === 1) {
                this.formGroup.patchValue({
                    designation: this.fournisseur.designation,
                    ice: this.fournisseur.ice,
                    tel1: this.fournisseur.tel1,
                    tel2: this.fournisseur.tel2,
                    type: this.fournisseur.type,
                    adresse: this.fournisseur.adresse
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
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
        }
    }

    updateList(fournisseur: Fournisseur, list: Fournisseur[], operationType: OperationType, id?: bigint): Fournisseur[] {
        if (operationType === OperationType.ADD) {
            list = [...list, fournisseur];
        } else if (operationType === OperationType.MODIFY) {
            let index = list.findIndex(x => x.id === fournisseur.id);
            if (index > -1) {
                list[index] = fournisseur;
            }
        } else if (operationType === OperationType.DELETE) {
            list = list.filter(x => x.id !== id);
        }
        return list;
    }

    checkIfListIsNull() {
        if (null == this.listFournisseur) {
            this.listFournisseur = [];
        }
    }

    mapFormGroupToObject(formGroup: FormGroup, fournisseur: Fournisseur): Fournisseur {
        fournisseur.designation = formGroup.get('designation')?.value;
        fournisseur.ice = formGroup.get('ice')?.value;
        fournisseur.tel1 = formGroup.get('tel1')?.value;
        fournisseur.tel2 = formGroup.get('tel2')?.value;
        fournisseur.type = formGroup.get('type')?.value;
        fournisseur.adresse = formGroup.get('adresse')?.value;
        //fournisseur.villeId = formGroup.get('villeId')?.value;

        return fournisseur;
    }

    async checkIfExists(fournisseur: Fournisseur): Promise<boolean> {
        try {
            const existsObservable = this.fournisseurService.exist(fournisseur).pipe(
                catchError(error => {
                    console.error('Error in fournisseur existence observable:', error);
                    return of(false); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if fournisseur exists:', error);
            return false;
        }
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let fournisseurEdit: Fournisseur = { ...this.fournisseur };
        this.mapFormGroupToObject(this.formGroup, fournisseurEdit);
        let trvErreur = await this.checkIfExists(fournisseurEdit);

        if (!trvErreur) {
            this.mapFormGroupToObject(this.formGroup, this.fournisseur);
            this.submitted = true;

            if (this.fournisseur.id) {
                this.fournisseurService.update(this.fournisseur.id, this.fournisseur).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageUpdateSuccess
                        });
                        this.checkIfListIsNull();
                        this.listFournisseur = this.updateList(data, this.listFournisseur, OperationType.MODIFY);
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
                this.fournisseurService.create(this.fournisseur).subscribe({
                    next: (data: Fournisseur) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.msg.summary.labelSuccess,
                            closable: true,
                            detail: this.msg.messages.messageAddSuccess
                        });
                        this.checkIfListIsNull();
                        this.listFournisseur = this.updateList(data, this.listFournisseur, OperationType.ADD);
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
            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.fournisseur.label} ${this.msg.messages.messageExistDeja}` });
            this.loadingService.hide();
        }
    }

    supprimer(): void {
        if (this.fournisseur && this.fournisseur.id) {
            this.loadingService.show();
            let id = this.fournisseur.id;
            this.fournisseurService.delete(this.fournisseur.id).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageDeleteSuccess
                    });
                    this.checkIfListIsNull();
                    this.listFournisseur = this.updateList(initObjectFournisseur(), this.listFournisseur, OperationType.DELETE, id);
                    this.fournisseur = initObjectFournisseur();
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
        if (this.fournisseur && this.fournisseur.id) {
            this.loadingService.show();
            let id = this.fournisseur.id;
            this.fournisseur.archiver = archiver;

            this.fournisseurService.update(this.fournisseur.id, this.fournisseur).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listFournisseur = this.updateList(initObjectFournisseur(), this.listFournisseur, OperationType.DELETE, id);
                    this.fournisseur = initObjectFournisseur();
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
        if (this.fournisseur && this.fournisseur.id) {
            this.loadingService.show();
            let id = this.fournisseur.id;
            this.fournisseur.supprimer = corbeille;

            this.fournisseurService.update(this.fournisseur.id, this.fournisseur).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.msg.summary.labelSuccess,
                        closable: true,
                        detail: this.msg.messages.messageSuccess
                    });
                    this.checkIfListIsNull();
                    this.listFournisseur = this.updateList(initObjectFournisseur(), this.listFournisseur, OperationType.DELETE, id);
                    this.fournisseur = initObjectFournisseur();
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
