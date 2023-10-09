import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeAccents',
})
export class RemoveAccentsPipe implements PipeTransform {
  transform(value: string): string {
    const accents = [
      /[\u0300-\u036f]/g, // Combining diacritical marks
    ];

    let normalizedString = value.normalize('NFKD');
    accents.forEach((accent) => {
      normalizedString = normalizedString.replace(accent, '');
    });

    return normalizedString;
  }
}
