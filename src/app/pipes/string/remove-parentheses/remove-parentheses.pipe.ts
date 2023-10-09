import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeParentheses',
})
export class RemoveParenthesesPipe implements PipeTransform {
  transform(value: string): string {
    const regex = /\(.*?\)/g;
    return value.replace(regex, '').trim();
  }
}
