import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { MessageService } from 'primeng/api';
import Nora from '@primeuix/themes/nora';
import { provideTranslateService } from "@ngx-translate/core";

export const appConfig: ApplicationConfig = {
    providers: [
        MessageService,
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        provideTranslateService({
            lang: 'fr',
            fallbackLang: 'en'
        }),
        providePrimeNG({ 
            theme: { 
                preset: Nora, 
                options: { 
                    darkModeSelector: '.app-dark' 
                }
            },
            translation: {
                dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                monthNames: [
                  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                ],
                monthNamesShort: [
                  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
                ],
                today: "Aujourd'hui",
                clear: 'Effacer',
                weekHeader: 'Sem',
                firstDayOfWeek: 1, // Monday (0 = Sunday, 1 = Monday)
                dateFormat: 'dd/mm/yy',
                weak: 'Faible',
                medium: 'Moyen',
                strong: 'Fort',
                passwordPrompt: 'Entrez un mot de passe',
                emptyMessage: 'Aucun résultat trouvé',
                emptyFilterMessage: 'Aucun résultat trouvé'
            }
        })
    ]
};
