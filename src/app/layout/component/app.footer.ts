import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
       Copyright ©
        <a routerLink="/" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Kabir</a>
    </div>`
})
export class AppFooter {}
