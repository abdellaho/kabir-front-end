import { Personnel } from '@/models/personnel';
import { Ville } from '@/models/ville';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RepertoireValidator } from '@/validators/repertoire-validator';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { initValidationResponse, ValidationResponse } from '@/shared/classes/responses/repertoire-validation-response';
import { initObjectRepertoire, Repertoire } from '@/models/repertoire';
import { RepertoireService } from '@/services/repertoire/repertoire-service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { OperationType } from '@/shared/enums/operation-type';
import { filteredTypeRepertoireExceptTransport } from '@/shared/enums/type-repertoire';

@Component({
    selector: 'app-repertoire-form-component',
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, FloatLabelModule, InputNumberModule, MessageModule],
    templateUrl: './repertoire-form-component.html',
    styleUrl: './repertoire-form-component.scss'
})
export class RepertoireFormComponent implements OnInit {
    formGroup!: FormGroup;
    submitted = false;
    repertoire: Repertoire = initObjectRepertoire();
    operationType: OperationType = OperationType.ADD;

    // These would typically come from a Service or the Dialog Config
    listVille: Ville[] = [];
    listPersonnel: Personnel[] = [];
    typeRepertoire: { label: string; value: number }[] = filteredTypeRepertoireExceptTransport;
    msg = APP_MESSAGES; // Your translation object

    constructor(
        public formBuilder: FormBuilder,
        private repertoireService: RepertoireService,
        private messageService: MessageService,
        private loadingService: LoadingService,
        public ref: DynamicDialogRef, // To close the dialog and return data
        public config: DynamicDialogConfig // To receive data (like editing an existing item)
    ) {
        this.listVille = this.config.data.villes;
        this.listPersonnel = this.config.data.personnel;

        this.initFormGroup();
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                typeRepertoire: [0, [Validators.required, Validators.min(1)]],
                designation: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]],
                villeId: [0, [Validators.required, Validators.min(1)]],
                tel1: ['', [Validators.maxLength(10)]],
                tel2: ['', [Validators.maxLength(10)]],
                tel3: ['', [Validators.maxLength(10)]],
                ice: ['', [Validators.maxLength(15)]],
                observation: ['', [Validators.maxLength(250)]],
                adresse: ['', [Validators.maxLength(250)]],
                personnelId: [0],
                plafond: [null]
            },
            { validators: [RepertoireValidator] }
        );
    }

    ngOnInit() {
        // If we are in "Edit" mode, patch the value
        if (this.config.data.repertoire) {
            this.operationType = OperationType.MODIFY;
            this.repertoire = this.config.data.repertoire;
            this.formGroup.patchValue({
                typeRepertoire: this.repertoire.typeRepertoire,
                designation: this.repertoire.designation,
                villeId: this.repertoire.villeId,
                tel1: this.repertoire.tel1,
                tel2: this.repertoire.tel2,
                tel3: this.repertoire.tel3,
                ice: this.repertoire.ice,
                adresse: this.repertoire.adresse,
                observation: this.repertoire.observation,
                personnelId: this.repertoire.personnelId ?? 0,
                plafond: this.repertoire.plafond !== 0 ? this.repertoire.plafond : null
            });
        } else {
            this.operationType = OperationType.ADD;
            this.repertoire = initObjectRepertoire();
            this.initFormGroup();
        }
    }

    onValidate() {
        this.miseAjour();
    }

    onClose() {
        this.ref.close({ operationType: this.operationType, data: this.repertoire });
    }

    mapFormGroupToObject(formGroup: FormGroup, repertoire: Repertoire): Repertoire {
        repertoire.typeRepertoire = formGroup.get('typeRepertoire')?.value;
        repertoire.designation = formGroup.get('designation')?.value;
        repertoire.villeId = formGroup.get('villeId')?.value;
        repertoire.tel1 = formGroup.get('tel1')?.value;
        repertoire.tel2 = formGroup.get('tel2')?.value;
        repertoire.tel3 = formGroup.get('tel3')?.value;
        repertoire.ice = formGroup.get('ice')?.value;
        repertoire.adresse = formGroup.get('adresse')?.value;
        repertoire.observation = formGroup.get('observation')?.value;
        repertoire.personnelId = formGroup.get('personnelId')?.value;
        repertoire.plafond = formGroup.get('plafond')?.value ?? 0;

        return repertoire;
    }

    async checkIfRepertoireExists(repertoire: Repertoire): Promise<ValidationResponse> {
        let validationResponse: ValidationResponse = initValidationResponse();
        try {
            const existsObservable = this.repertoireService.exist(repertoire).pipe(
                catchError((error) => {
                    console.error('Error in repertoire existence observable:', error);
                    return of(validationResponse); // Gracefully handle observable errors by returning false
                })
            );
            return await firstValueFrom(existsObservable);
        } catch (error) {
            console.error('Unexpected error checking if repertoire exists:', error);
            return validationResponse;
        }
    }

    async miseAjour(): Promise<void> {
        this.loadingService.show();
        let repertoireEdit: Repertoire = { ...this.repertoire };
        this.mapFormGroupToObject(this.formGroup, repertoireEdit);
        let repertoireSearch: Repertoire = { ...repertoireEdit };
        let validationResponse: ValidationResponse = await this.checkIfRepertoireExists(repertoireSearch);

        if (!validationResponse.exists) {
            this.mapFormGroupToObject(this.formGroup, this.repertoire);
            this.submitted = true;

            if (this.repertoire.id) {
                this.repertoireService.update(this.repertoire.id, this.repertoire).subscribe({
                    next: (data) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageUpdateSuccess });
                        this.onClose();
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            } else {
                this.repertoireService.create(this.repertoire).subscribe({
                    next: (data: Repertoire) => {
                        this.messageService.add({ severity: 'success', summary: this.msg.summary.labelSuccess, closable: true, detail: this.msg.messages.messageAddSuccess });
                        this.onClose();
                    },
                    error: (err) => {
                        console.log(err);
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: this.msg.messages.messageError });
                    },
                    complete: () => {
                        this.loadingService.hide();
                    }
                });
            }
        } else {
            if (validationResponse.errors['designation']) {
                this.formGroup.get('designation')?.setErrors({ exist: true, message: validationResponse.errors['designation'] });
            }
            if (validationResponse.errors['tel1']) {
                this.formGroup.get('tel1')?.setErrors({ exist: true, message: validationResponse.errors['tel1'] });
            }
            if (validationResponse.errors['tel2']) {
                this.formGroup.get('tel2')?.setErrors({ exist: true, message: validationResponse.errors['tel2'] });
            }
            if (validationResponse.errors['tel3']) {
                this.formGroup.get('tel3')?.setErrors({ exist: true, message: validationResponse.errors['tel3'] });
            }
            if (validationResponse.errors['ice']) {
                this.formGroup.get('ice')?.setErrors({ exist: true, message: validationResponse.errors['ice'] });
            }
            this.formGroup.updateValueAndValidity();

            this.messageService.add({ severity: 'error', summary: this.msg.summary.labelError, detail: `${this.msg.components.repertoire.label} ${this.msg.messages.messageExistDeja}` });
            this.loadingService.hide();
        }
    }
}
