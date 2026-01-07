import { Component, OnInit } from '@angular/core';
import { AppFloatingConfigurator } from "@/layout/component/app.floatingconfigurator";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthSecurityService } from '@/state/auth-security-service';
import { AuthRequest } from '@/state/auth-request';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { StateService } from '@/state/state-service';
import { Erreur } from '@/shared/classes/erreur';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login-component',
  imports: [
    AppFloatingConfigurator, 
    PasswordModule, 
    CheckboxModule, 
    InputTextModule,
    ButtonModule, 
    RippleModule,
    SkeletonModule,
    ToastModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit{

  formGroup!: FormGroup;
  adminExist: boolean = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private personnelService: PersonnelService,
    private stateService: StateService,
    private router: Router,
    private authService: AuthSecurityService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loading = true; // Set loading to true at the start
    try {
      this.adminExist = await this.checkAdminExist();
    } catch (error) {
      console.error('Error during init:', error);
      this.adminExist = false; // Fallback value
    } finally {
      this.initForm();
      this.loading = false; // Always set to false after completion
    }
  }

  async checkAdminExist(): Promise<boolean> {
    try {
        const existsObservable = this.personnelService.adminExist().pipe(
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

  initForm(){
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(1)]],
      rememberMe: [false],
    });
  }

  login() {
    this.stateService.setState({ loading: true, error: null });

    const authRequest: AuthRequest = {
      email: this.formGroup.get('email')?.value,
      password: this.formGroup.get('password')?.value
    };
    
    if(this.adminExist) {
      this.authService.login(authRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error: Erreur) => {
          this.stateService.setState({ loading: false, error: error.message });
          console.log('error', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }, 
        complete: () => {
          this.stateService.setState({ loading: false });
        }
      });
    } else {
      this.authService.register(authRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error: Erreur) => {
          this.stateService.setState({ loading: false, error: error.message });
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        },
        complete: () => {
          this.stateService.setState({ loading: false });
        }
      });
    }
  }

}
