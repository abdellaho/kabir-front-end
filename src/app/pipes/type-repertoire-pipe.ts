import { TypeRepertoire } from '@/shared/enums/type-repertoire';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeRepertoirePipe'
})
export class TypeRepertoirePipe implements PipeTransform {
    transform(value: number): string {
        const labels: Record<number, string> = {
            [TypeRepertoire.PHARMACIE]: 'Pharmacie',
            [TypeRepertoire.REVENDEUR]: 'Revendeur',
            [TypeRepertoire.TRANSPORT]: 'Transport'
        };
        return labels[value] || '';
    }
}
