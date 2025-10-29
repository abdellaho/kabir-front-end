import { TypeFourniseur } from '@/shared/enums/type-fournisseur';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeFournisseur'
})
export class TypeFournisseurPipe implements PipeTransform {

  transform(value: number): string {
    const labels: Record<number, string> = {
      [TypeFourniseur.MARCHANDISES]: 'Marchandises',
      [TypeFourniseur.SERVICES]: 'Services',
      [TypeFourniseur.DOUANES]: 'Douanes',
      [TypeFourniseur.CARBURANT]: 'Carburant',
      [TypeFourniseur.FOURNITURE]: 'Fourniture',
    };
    return labels[value] || '';
  }

}
