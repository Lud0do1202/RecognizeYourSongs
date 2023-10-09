import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePunctuations',
})
export class RemovePunctuationsPipe implements PipeTransform {
  transform(string: string): string {
    // Define the regular expression to match punctuations
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

    // Remove punctuations from the input string using the replace() method
    return string.replace(punctuationRegex, '');
  }
}
