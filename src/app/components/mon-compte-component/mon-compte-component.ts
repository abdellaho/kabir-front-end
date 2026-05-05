import { PersonnelService } from '@/services/personnel/personnel-service';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { AuthSecurityService } from '@/state/auth-security-service';
import { StateService } from '@/state/state-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoadingService } from '@/shared/services/loading-service';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-mon-compte-component',
    imports: [PasswordModule, CheckboxModule, InputTextModule, ButtonModule, RippleModule, SkeletonModule, ToastModule, CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './mon-compte-component.html',
    styleUrl: './mon-compte-component.scss'
})
export class MonCompteComponent implements OnInit {
    msg = APP_MESSAGES;
    userConnected!: Personnel;
    formGroup!: FormGroup;
    submitted: boolean = false;
    loading: boolean = false;

    constructor(
        private personnelService: PersonnelService,
        private messageService: MessageService,
        private authService: AuthSecurityService,
        private stateService: StateService,
        private formBuilder: FormBuilder,
        private loadingService: LoadingService
    ) {}

    async ngOnInit() {
        this.loading = true;
        try {
            this.init();
        } catch (error) {
            console.error('Error during init:', error);
        } finally {
            this.loading = false;
        }
    }

    init(): void {
        this.initFormGroup();
        this.userConnected = this.stateService.getState().user?.personnel || initObjectPersonnel();
        this.mapUserStateToForm(this.userConnected);
    }

    initFormGroup() {
        this.formGroup = this.formBuilder.group({
            login: ['', [Validators.required, Validators.min(1)]],
            password: ['', [Validators.required, Validators.min(1)]]
        });
    }

    mapFormToPersonnel(user: Personnel): Personnel {
        user.email = this.formGroup.get('login')?.value;
        user.passwordFake = this.formGroup.get('password')?.value;
        return user;
    }

    save() {
        this.loadingService.show();
        let user: Personnel = this.mapFormToPersonnel(this.userConnected);
        this.personnelService.monCompte(user).subscribe({
            next: (data: any) => {
                this.authService.refreshUserState(data);
                this.userConnected = this.stateService.getState().user?.personnel || initObjectPersonnel();
                this.mapUserStateToForm(this.userConnected);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: data.message });
            },
            error: (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message });
            },
            complete: () => {
                this.loadingService.hide();
            }
        });
    }

    mapUserStateToForm(user: Personnel) {
        this.formGroup.patchValue({
            login: user.email,
            password: user.passwordFake
        });
        this.formGroup.updateValueAndValidity();
    }
}
