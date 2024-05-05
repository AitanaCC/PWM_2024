import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moveCurrencySymbol',
  standalone: true
})
export class MoveCurrencySymbolPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    // Luego continúa con tu lógica original
    if (value.includes('€')) {
      return value.replace('€', '').trim() + ' €';
    }
    return value;
  }
}
