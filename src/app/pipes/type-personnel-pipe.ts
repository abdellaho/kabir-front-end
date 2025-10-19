import { TypePersonnel } from '@/shared/enums/type-personnel';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typePersonnelPipe'
})
export class TypePersonnelPipe implements PipeTransform {

  transform(value: TypePersonnel): string {
    const labels: Record<TypePersonnel, string> = {
      [TypePersonnel.NONE]: '',
      [TypePersonnel.ADMINISTRATEUR]: 'Administrateur',
      [TypePersonnel.GERANT]: 'Gérant',
      [TypePersonnel.COMPATBLE]: 'Comptable',
      [TypePersonnel.MAGASINIER]: 'Magasinier',
      [TypePersonnel.COMMERCIAL_INTERNE]: 'Commercial Interne',
      [TypePersonnel.COMMERCIAL_EXTERNE]: 'Commercial Externe'
    };
    return labels[value] || '';
  }

}
