import { FormControl, FormGroup } from '@angular/forms';

import { initObjectStock, Stock } from '@/models/stock';
import { DetLivraisonValidator } from '@/validators/det-livraison-validator';

function stockTest2(): Stock {
    return {
        ...initObjectStock(),
        id: BigInt(2),
        designation: 'Test2',
        pvttc: 60,
        remiseMax1: 33.333333333333336,
        remiseMax2: 16.666666666666668,
        remiseMax3: 0,
        remiseMax4: 0,
        prixVentMin1: 80,
        prixVentMin2: 70,
        prixVentMin3: 0,
        prixVentMin4: 0
    };
}

function initFormGroup(holder: { stock: Stock }, remise: number | null, prixVente = 60): FormGroup {
    return new FormGroup(
        {
            prixVente: new FormControl(prixVente),
            remiseLivraison: new FormControl(remise)
        },
        { validators: DetLivraisonValidator({ getStock: () => holder.stock }) }
    );
}

describe('DetLivraisonValidator', () => {
    it('accepts a remise below the stock remise max', () => {
        const formGroup = initFormGroup({ stock: stockTest2() }, 10);

        expect(formGroup.valid).toBeTrue();
        expect(formGroup.errors).toBeNull();
    });

    it('rejects a remise above the stock remise max', () => {
        const formGroup = initFormGroup({ stock: stockTest2() }, 20);

        expect(formGroup.valid).toBeFalse();
        expect(formGroup.errors).toEqual({ remiseLivraisonMustBeAtMostEqualRemiseMax: true });
    });

    it('accepts a remise of 100', () => {
        const formGroup = initFormGroup({ stock: stockTest2() }, 100);

        expect(formGroup.valid).toBeTrue();
        expect(formGroup.errors).toBeNull();
    });

    it('reads the stock on every validation run instead of capturing it', () => {
        const holder = { stock: initObjectStock() };
        const formGroup = initFormGroup(holder, 10);

        expect(formGroup.valid).toBeFalse();
        expect(formGroup.errors).toEqual({ remiseLivraisonMustBeAtMostEqualRemiseMax: true });

        holder.stock = stockTest2();
        formGroup.updateValueAndValidity();

        expect(formGroup.valid).toBeTrue();
        expect(formGroup.errors).toBeNull();
    });

    it('does not check the price when prixVente equals the stock pvttc', () => {
        const formGroup = initFormGroup({ stock: stockTest2() }, 20, 60);

        expect(formGroup.valid).toBeFalse();
        expect(formGroup.errors).toEqual({ remiseLivraisonMustBeAtMostEqualRemiseMax: true });
        expect(formGroup.errors?.['prixVenteMustBeAtLeastEqualPrixVenteMin']).toBeUndefined();
    });

    it('checks the price once prixVente differs from the stock pvttc', () => {
        const formGroup = initFormGroup({ stock: stockTest2() }, 10, 55);

        expect(formGroup.valid).toBeFalse();
        expect(formGroup.errors).toEqual({ prixVenteMustBeAtLeastEqualPrixVenteMin: true });
        expect(formGroup.errors?.['remiseLivraisonMustBeAtMostEqualRemiseMax']).toBeUndefined();
    });
});
