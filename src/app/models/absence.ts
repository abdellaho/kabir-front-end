import { Personnel } from './personnel';

export interface Absence {
    id: bigint | null;
    dateAbsence: Date;
    matin: boolean;
    apresMidi: boolean;
    dateOperation: Date;
    personnelOperationId: bigint | null;
    personnelId: bigint | null;
    personnelDesignation: string;
    dateAbsenceStr?: string;
}

export function initObjectAbsence(): Absence {
    return {
        id: null,
        dateAbsence: new Date(),
        matin: false,
        apresMidi: false,
        dateOperation: new Date(),
        personnelOperationId: null,
        personnelId: null,
        personnelDesignation: '',
        dateAbsenceStr: ''
    };
}
