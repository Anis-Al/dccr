import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'devise',
  standalone: true
})
export class DevisePipe implements PipeTransform {
  transform(
    valeur: number | null | undefined,
    devise: string | null | undefined,
  ): string {
    if (valeur === null || valeur === undefined || !devise) {
      return 'N/A';
    }

    const format = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valeur);

    return `${format} ${devise}`;
  }
}
