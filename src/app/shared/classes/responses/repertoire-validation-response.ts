export interface ValidationResponse {
    exists: boolean;
    errors: {
        [key: string]: string; // ex: { designation: '...', tel1: '...' }
    };
}

export function initValidationResponse(): ValidationResponse {
    return {
        exists: true,
        errors: {}
    };
}
