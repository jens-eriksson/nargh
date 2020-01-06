import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common'

@Pipe({
  name: 'currency'
})
export class ExtendedCurrencyPipe extends CurrencyPipe implements PipeTransform {
  transform(value: any, currencyCode?: string, hideSymbol?: boolean): string {
    let result;

    switch(currencyCode){
        case "SEK":
        if(value) {
          result = parseFloat(value).toFixed(2)
          if(!hideSymbol) {
            result += " kr"; 
          }
        }
        break;

        default:
        result = super.transform(value, currencyCode);
        break;
    }
        
    return result;
  }

}