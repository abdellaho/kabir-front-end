import { AuthSecurityService } from '@/state/auth-security-service';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(
        private config: PrimeNG,
        private translateService: TranslateService,
        private authService: AuthSecurityService
    ) {}

    ngOnInit() {
        this.translateService.setDefaultLang('fr');
        this.authService.initAuth();
    }

    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe((res) => this.config.setTranslation(res));
    }
}
