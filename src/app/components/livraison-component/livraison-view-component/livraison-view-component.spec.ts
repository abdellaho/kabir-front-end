import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FactureService } from '@/services/facture/facture-service';
import { LivraisonService } from '@/services/livraison/livraison-service';
import { PersonnelService } from '@/services/personnel/personnel-service';
import { RepertoireService } from '@/services/repertoire/repertoire-service';
import { StockService } from '@/services/stock/stock-service';
import { VilleService } from '@/services/ville/ville-service';
import { initObjectLivraison, Livraison } from '@/models/livraison';
import { initObjectPersonnel } from '@/models/personnel';
import { DataService } from '@/shared/services/data-service';
import { LoadingService } from '@/shared/services/loading-service';
import { PermissionService } from '@/shared/services/permission-service';
import { LivraisonViewComponent } from './livraison-view-component';

describe('LivraisonViewComponent - Consulter etats 2/4/5/6 + numCheque + Livrer (FEATURE 9)', () => {
    let component: LivraisonViewComponent;
    let fixture: ComponentFixture<LivraisonViewComponent>;
    let livraisonServiceMock: any;
    let messageServiceMock: any;

    beforeEach(async () => {
        livraisonServiceMock = {
            searchByCommon: jasmine.createSpy('searchByCommon').and.returnValue(of([])),
            imprimerParNumCheque: jasmine.createSpy('imprimerParNumCheque').and.returnValue(of(new Blob(['%PDF'], { type: 'application/pdf' }))),
            livrer: jasmine.createSpy('livrer').and.returnValue(of({ id: '5', livrernonlivrer: 1 })),
            imprimerEtat: jasmine.createSpy('imprimerEtat').and.returnValue(of(new Blob(['%PDF'], { type: 'application/pdf' })))
        };
        messageServiceMock = { add: jasmine.createSpy('add') };

        await TestBed.configureTestingModule({
            imports: [LivraisonViewComponent],
            providers: [
                { provide: LivraisonService, useValue: livraisonServiceMock },
                { provide: FactureService, useValue: {} },
                { provide: RepertoireService, useValue: { search: () => of([]) } },
                { provide: StockService, useValue: { search: () => of([]) } },
                { provide: PersonnelService, useValue: { getAllExceptAdmin: () => of([]) } },
                { provide: VilleService, useValue: { getVilles: () => of([]) } },
                {
                    provide: PermissionService,
                    useValue: {
                        getCurrentUserRole: () => ({ personnel: initObjectPersonnel(), role: { isAdmin: true } })
                    }
                },
                { provide: DataService, useValue: { setLivraisonData: () => undefined } },
                { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
                { provide: MessageService, useValue: messageServiceMock },
                { provide: LoadingService, useValue: { show: () => undefined, hide: () => undefined } }
            ]
        })
            .overrideComponent(LivraisonViewComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        fixture = TestBed.createComponent(LivraisonViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn<any>(component, 'openPdfBlob').and.stub();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('viderConsulter(2) resets the selectors, opens the dialog and builds the ville + client-2 lists', () => {
        component.listRepertoire = [
            { id: 1n, designation: 'Client A', typeRepertoire: 0 } as any,
            { id: 2n, designation: 'Fournisseur B', typeRepertoire: 1 } as any,
            { id: 3n, designation: 'Client C', typeRepertoire: 3 } as any
        ];
        component.listVille = [{ id: 5n, nomVille: 'Casablanca' } as any];

        component.viderConsulter(2);

        expect(component.typeImpression).toBe(2);
        expect(component.reglerNonRegler).toBe(0);
        expect(component.villeIdImpr).toBe(0);
        expect(component.repertoireClientId2Impr).toBe(0);
        expect(component.dialogConsulter).toBeTrue();

        expect(component.listVilleImpr.map((ville) => ville.nomVille)).toEqual([component.msg.buttons.tousLesVilles, 'Casablanca']);
        // type 6 client list keeps only typeRepertoire 0 and 3
        expect(component.listClient2Impr.map((client) => client.designation)).toEqual([
            component.msg.components.livraison.imprimer.client,
            'Client A',
            'Client C'
        ]);
    });

    it('viderConsulter(4) builds the regle/non-regle options without the placeholder client-2 list', () => {
        component.viderConsulter(4);

        expect(component.typeImpression).toBe(4);
        expect(component.listReglerNonReglerImpr.map((option) => option.label)).toEqual([
            component.msg.buttons.livraisonNonRegler,
            component.msg.buttons.livraisonRegler
        ]);
        expect(component.reglerNonRegler).toBe(0);
    });

    it('mntChequeTotal is 0 while numChequeSearch is empty, else sums mantantBL of the current list', () => {
        expect(component.mntChequeTotal).toBe(0);

        component.numChequeSearch = '   ';
        expect(component.mntChequeTotal).toBe(0);

        component.numChequeSearch = '123456';
        component.listLivraison = [{ mantantBL: 100.5 } as any, { mantantBL: 200 } as any, {} as any];
        expect(component.mntChequeTotal).toBe(300.5);
    });

    it('openCloseDialogNumCheque opens the dialog and clears the checque reference', () => {
        component.numChequeLibel = 'old';
        component.openCloseDialogNumCheque(true);
        expect(component.dialogNumCheque).toBeTrue();
        expect(component.numChequeLibel).toBe('');

        component.openCloseDialogNumCheque(false);
        expect(component.dialogNumCheque).toBeFalse();
    });

    it('imprimerParNumCheque calls the service with the dialog reference and opens the PDF blob', () => {
        component.numChequeLibel = '999';
        component.imprimerParNumCheque();

        expect(livraisonServiceMock.imprimerParNumCheque).toHaveBeenCalledWith('999');
        expect((component as any).openPdfBlob).toHaveBeenCalled();
    });

    it('openCloseDialogLivrer stores the livraison and its livrernonlivrer value', () => {
        const livraison: Livraison = { ...initObjectLivraison(), id: 5n, livrernonlivrer: 1 };
        component.openCloseDialogLivrer(true, livraison);

        expect(component.dialogLivrer).toBeTrue();
        expect(component.livraison).toBe(livraison);
        expect(component.livrernonlivrer).toBe(1);

        component.openCloseDialogLivrer(false);
        expect(component.dialogLivrer).toBeFalse();
    });

    it('livrerNonLivrer persists the flag, shows a success message and refreshes the list', () => {
        const livraison: Livraison = { ...initObjectLivraison(), id: 5n, livrernonlivrer: 0 };
        component.openCloseDialogLivrer(true, livraison);
        component.livrernonlivrer = 1;

        component.livrerNonLivrer();

        expect(livraisonServiceMock.livrer).toHaveBeenCalledWith(5n, 1);
        expect(messageServiceMock.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
        expect(component.dialogLivrer).toBeFalse();
        expect(livraisonServiceMock.searchByCommon).toHaveBeenCalledWith(jasmine.anything());
    });

    it('imprimerEtat feeds the new print request fields for type 6', () => {
        const livraisonServiceMock2 = livraisonServiceMock.imprimerEtat;
        component.viderConsulter(6);
        component.repertoireClientId2Impr = 7;

        component.imprimerEtat();

        expect(livraisonServiceMock2).toHaveBeenCalledWith(
            jasmine.objectContaining({ type: 6, reglerNonRegler: 0, villeId: 0, repertoireClientId2: 7 })
        );
    });
});