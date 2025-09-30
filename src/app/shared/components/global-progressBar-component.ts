import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading-service';

@Component({
    standalone: true,
    selector: 'app-global-progress-bar',
    template: `
        <p-progressBar *ngIf="loading | async" mode="indeterminate"></p-progressBar>
    `,
    styles: [`
        :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        }
    `],
    imports: [CommonModule, ProgressBarModule]
})
export class GlobalProgressBarComponent {
    loading: typeof this.loadingService.loading$;

    constructor(private loadingService: LoadingService) {
        this.loading = this.loadingService.loading$;
    }
}