import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeEndDash',
})
export class RemoveEndDashPipe implements PipeTransform {
  transform(value: string): string {
    const regex = /\s-\s.*$/g;
    return value.replace(regex, '').trim();
  }
}
