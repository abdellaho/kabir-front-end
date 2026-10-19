import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { StateService } from '@/state/state-service';

describe('AppComponent - backend unreachable toast (FEATURE 8)', () => {
    let fixture: ComponentFixture<AppComponent>;
    let stateService: StateService;
    let messageService: MessageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideRouter([]),
                providePrimeNG({}),
                MessageService,
                StateService,
                { provide: TranslateService, useValue: { setDefaultLang: () => undefined, use: () => undefined, get: () => of({}) } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        stateService = TestBed.inject(StateService);
        messageService = TestBed.inject(MessageService);
        stateService.setState({ backendUnreachable: false });
    });

    it('replays a startup outage flagged before the view initialises (subscription in ngAfterViewInit)', () => {
        // Simulate the app-startup failure: the flag is already true before AppComponent boots.
        stateService.setState({ backendUnreachable: true });

        const addSpy = spyOn(messageService, 'add');
        fixture.detectChanges(); // runs ngOnInit then ngAfterViewInit

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                key: 'backend',
                severity: 'error',
                sticky: true,
                detail: APP_MESSAGES.messages.backendUnreachable
            })
        );
    });

    it('adds exactly one keyed toast when the flag turns true (no stacking on repeats)', () => {
        fixture.detectChanges();

        const addSpy = spyOn(messageService, 'add');
        const clearSpy = spyOn(messageService, 'clear');

        stateService.setState({ backendUnreachable: true });
        stateService.setState({ backendUnreachable: true });
        stateService.setState({ backendUnreachable: true });

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy).toHaveBeenCalledWith(jasmine.objectContaining({ key: 'backend' }));
        expect(clearSpy).not.toHaveBeenCalled();
    });

    it('clears only the keyed backend toast when the flag resets to false', () => {
        fixture.detectChanges();

        const addSpy = spyOn(messageService, 'add');
        const clearSpy = spyOn(messageService, 'clear');

        stateService.setState({ backendUnreachable: true });
        expect(addSpy).toHaveBeenCalledTimes(1);

        stateService.setState({ backendUnreachable: false });
        expect(clearSpy).toHaveBeenCalledTimes(1);
        expect(clearSpy).toHaveBeenCalledWith('backend');
    });
});
