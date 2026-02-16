export interface RepertoireValidationResponse {
    exists: boolean;
    errors: {
        [key: string]: string; // ex: { designation: '...', tel1: '...' }
    };
}

export function initRepertoireValidationResponse(): RepertoireValidationResponse {
    return {
        exists: true,
        errors: {}
    };
}
