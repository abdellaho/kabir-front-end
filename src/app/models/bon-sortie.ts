export interface BonSortie {
    id: bigint | null;
    numSortie: number;
    codeSortie: string;
    dateOperation: Date;
    mnt: number;
    personnelId: bigint | null;
    personnelDesignation: string;
    repertoireId: bigint | null;
    repertoireDesignation: string;
}

export function initObjectBonSortie(): BonSortie {
    return {
        id: null,
        numSortie: 0,
        codeSortie: '',
        dateOperation: new Date(),
        mnt: 0,
        personnelId: null,
        personnelDesignation: '',
        repertoireId: null,
        repertoireDesignation: ''
    };
}
