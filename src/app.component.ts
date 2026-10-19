import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { StateService } from '@/state/state-service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `<router-outlet></router-outlet><p-toast key="backend" position="top-center" [preventOpenDuplicates]="true"/>`
})
export class AppComponent implements OnInit, AfterViewInit {
    private destroyRef = inject(DestroyRef);

    constructor(
        private config: PrimeNG,
        private translateService: TranslateService,
        private messageService: MessageService,
        private stateService: StateService
    ) {}

    ngOnInit() {
        this.translateService.setDefaultLang('fr');
    }

    ngAfterViewInit() {
        // Subscribe here (not in ngOnInit): the child <p-toast> only subscribes to
        // MessageService.messageObserver in its own onInit, which runs after this
        // component's ngOnInit but before ngAfterViewInit. Subscribing earlier would
        // silently drop the message (including a startup outage already flagged).
        this.stateService
            .select('backendUnreachable')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((backendUnreachable) => {
                if (backendUnreachable) {
                    this.messageService.add({
                        key: 'backend',
                        severity: 'error',
                        sticky: true,
                        summary: APP_MESSAGES.summary.labelError,
                        detail: APP_MESSAGES.messages.backendUnreachable
                    });
                } else {
                    // Always clear by key: a keyless clear() would wipe the per-component toasts.
                    this.messageService.clear('backend');
                }
            });
    }

    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe((res) => this.config.setTranslation(res));
    }
}
