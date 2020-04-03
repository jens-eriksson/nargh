import { Injectable } from '@angular/core';
import { Investment } from '../model/investment';

declare var google: any;

@Injectable()
export class UtilProvider {
    public monthToNumber(month: string): number {
        if (month) {
          return (
            Number.parseInt(month.split('-')[0], 10) * 12 +
            Number.parseInt(month.split('-')[1], 10) - 1
          );
        } else {
          return 0;
        }
    }

    public monthToString(month: number) {
        const year = Math.floor(month / 12);
        let monthStr = (month - year * 12 + 1).toString();
        if (monthStr.length === 1) {
            monthStr = '0' + monthStr;
        }

        return year + '-' + monthStr;
    }

    public getBondAmount(investment: Investment, month: string) {
        if (!month) {
          return 0;
        }
        const monthNum = this.monthToNumber(month);
        let salesMonth = Infinity;
        if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
          salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
        }
        let amount = 0;
        if (salesMonth >= monthNum) {
          for (const fin of investment.financing) {
            if (this.monthToNumber(fin.month) <= monthNum) {
              amount += fin.bond;
            }
          }
        }
        return amount;
    }

    public getBankLoanAmount(investment: Investment, month: string) {
        if (!month) {
          return 0;
        }
        const monthNum = this.monthToNumber(month);
        let salesMonth = Infinity;
        if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
          salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
        }
        let amount = 0;
        if (salesMonth >= monthNum) {
          for (const fin of investment.financing) {
            if (this.monthToNumber(fin.month) <= monthNum) {
              amount += fin.bankLoan;
            }
          }
        }
        return amount;
    }

    public getEquityAmount(investment: Investment, month: string) {
        if (!month) {
            return 0;
        }
        const monthNum = this.monthToNumber(month);
        let salesMonth = Infinity;
        if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
            salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
        }
        let amount = 0;
        if (salesMonth >= monthNum) {
            for (const fin of investment.financing) {
            if (this.monthToNumber(fin.month) <= monthNum) {
                amount += fin.equity;
            }
            }
        }
        return amount;
    }

    public addFraction(prop: string) {
        const x = this[prop].split('.');
        const x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '.00';
        x2 = x2.length === 2 ? x2 + '0' : x2;
        this[prop] = x1 + x2;
    }

    public toNumberString(n: number): string {
        try {
            if (n === 0) {
            return '0';
            }
            const nStr = n.toString();
            const x = nStr.split('.');
            let x1 = x[0];
            const x2 = x.length > 1 ? '.' + x[1] : '';
            const rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ' ' + '$2');
            }
            return  x1 + x2;
        } catch {
            return null;
        }
    }

    public toNumber(nStr: string): number {
        try {
            nStr = nStr.split(' ').join('');
            nStr = nStr.replace(',', '.');
            return Number(nStr);
        } catch {
            return 0;
        }
    }

    public isEqual(a, b) {
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);

        if (aProps.length !== bProps.length) {
            return false;
        }

        for (const prop of aProps) {
            if (a[prop] !== b[prop]) {
                return false;
            }
        }
        return true;
    }
}
