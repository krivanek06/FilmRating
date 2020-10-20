import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'numberFormatter'
})
export class NumberFormatterPipe implements PipeTransform {

    transform(value: number): unknown {
        if (!this.isNumber(value)) {
            console.log('not number', value);
            return value;
        }

        let symbol = '';
        if (value > 1000 || value < -1000) {
            value = value / 1000;
            symbol = 'K';
        }

        if (value > 1000 || value < -1000) {
            value = value / 1000;
            symbol = 'mil.';
        }

        if (value > 1000 || value < -1000) {
            value = value / 1000;
            symbol = 'B';
        }

        if (value > 1000 || value < -1000) {
            value = value / 1000;
            symbol = 'T';
        }
        const result = value.toFixed(2);
        return result + symbol;
    }

    isNumber(value: string | number): boolean {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    }
}


