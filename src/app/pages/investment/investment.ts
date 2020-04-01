import { ModalPageProvider } from '../../providers/modal-page.provider';
import { InvestmentProvider } from '../../providers/investment.provider';
import { Investment } from '../../model/investment';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.html',
  styleUrls: ['./investment.scss']
})
export class InvestmentPage implements OnInit {
  id: string;
  investment: Investment = new Investment();
  timespan: string;
  financing: {
    month: string,
    bankLoan: string,
    bond: string,
    equity: string
  } = {
    month: null,
    bankLoan: null,
    bond: null,
    equity: null
  };
  bankLoan: string;
  bond: string;
  equity: string;
  bankIntrestRate: string;
  bondIntrestRate: string;
  salesPrice: string;
  revenue: string;
  operatingCost: string;
  startDate = new Date();

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalPageProvider: ModalPageProvider
    ) {
  }

  ngOnInit() {
    if (this.id) {
      this.investmentProvider.get(this.id).subscribe(investment => {
        this.investment.fromObject(investment);
        this.timespan = this.toNumberString(investment.propertyDevelopment.timespan);
        this.equity = this.toNumberString(investment.equity);
        this.bankLoan = this.toNumberString(investment.bankLoan);
        this.bond = this.toNumberString(investment.bond);
        this.bankIntrestRate = this.toNumberString(investment.bankIntrestRate);
        this.addFraction('bankIntrestRate');
        this.bondIntrestRate = this.toNumberString(investment.bondIntrestRate);
        this.addFraction('bondIntrestRate');
        this.salesPrice = this.toNumberString(investment.propertyDevelopment.salesPrice);
        this.revenue = this.toNumberString(investment.rentalBusiness.revenue);
        this.operatingCost = this.toNumberString(investment.rentalBusiness.operatingCost);
      });
    }
  }

  addFinancing(financing) {
    if (financing.month && (financing.bankLoan || financing.bond || financing.equity)) {
      const f = {
        month: financing.month,
        bankLoan: this.toNumber(financing.bankLoan),
        bond: this.toNumber(financing.bond),
        equity: this.toNumber(financing.equity)
      };
      this.investment.financing.push(f);
      this.investment.financing.sort((a, b) => {
        if ( a.month < b.month ) {
          return -1;
        }
        if ( a.month > b.month ) {
          return 1;
        }
        return 0;
      });
      this.investment.calculate();
    }
    this.financing = {
      month: null,
      bankLoan: null,
      bond: null,
      equity: null
    };
  }

  removeFinancing(financing) {
    this.investment.financing = this.investment.financing.filter(f => !this.isEqual(f, financing));
    this.investment.calculate();
  }

  saveAndClose(form: NgForm) {
    if (form.valid) {
      this.investment.generateId();
      this.investmentProvider.set(this.investment.toObject()).then(() => {
        this.modalPageProvider.close();
      });
    }
  }

  save() {
    this.investment.calculate();
    this.investment.generateId();
    this.investmentProvider.set(this.investment.toObject());
  }

  timespanChange(timespan) {
    this.investment.propertyDevelopment.timespan = this.toNumber(timespan);
    this.timespan = this.toNumberString(this.investment.propertyDevelopment.timespan);
    this.investment.calculate();
  }

  bankLoanChange(bankLoan) {
    this.financing.bankLoan = this.toNumberString(this.toNumber(bankLoan));
  }

  bondChange(bond) {
    this.financing.bond = this.toNumberString(this.toNumber(bond));
  }

  equityChange(equity) {
    this.financing.equity = this.toNumberString(this.toNumber(equity));
  }

  bankIntrestRateChange(bankIntrestRate) {
    if (!bankIntrestRate.endsWith('.')) {
      this.investment.bankIntrestRate = this.toNumber(bankIntrestRate);
      this.bankIntrestRate = this.toNumberString(this.investment.bankIntrestRate);
      this.investment.calculate();
    }
  }

  bondIntrestRateChange(bondIntrestRate) {
    if (!bondIntrestRate.endsWith('.')) {
      this.investment.bondIntrestRate = this.toNumber(bondIntrestRate);
      this.bondIntrestRate = this.toNumberString(this.investment.bondIntrestRate);
      this.investment.calculate();
    }
  }

  salesPriceChange(salesPrice) {
    this.investment.propertyDevelopment.salesPrice = this.toNumber(salesPrice);
    this.salesPrice = this.toNumberString(this.investment.propertyDevelopment.salesPrice);
    this.investment.calculate();
  }

  revenueChange(revenue) {
    this.investment.rentalBusiness.revenue = this.toNumber(revenue);
    this.revenue = this.toNumberString(this.investment.rentalBusiness.revenue);
    this.investment.calculate();
  }

  operatingCostChange(operatingCost) {
    this.investment.rentalBusiness.operatingCost = this.toNumber(operatingCost);
    this.operatingCost = this.toNumberString(this.investment.rentalBusiness.operatingCost);
    this.investment.calculate();
  }

  hasPropertyDevelopmentChange() {
    if (!this.investment.hasPropertyDevelopment) {
      this.investment.propertyDevelopment.salesPrice = null;
      this.salesPrice =  null;
      this.investment.propertyDevelopment.timespan = null;
      this.timespan = null;
    }

    this.investment.calculate();
  }

  hasRentalBusinessChange() {
    if (!this.investment.hasRentalBusiness) {
      this.investment.rentalBusiness.revenue = null;
      this.revenue = null;
      this.investment.rentalBusiness.operatingCost = null;
      this.operatingCost = null;
    }
    this.investment.calculate();
  }

  dateChange() {
    console.log(this.investment);
    this.investment.calculate();
  }

  addFraction(prop: string) {
    const x = this[prop].split('.');
    const x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '.00';
    x2 = x2.length === 2 ? x2 + '0' : x2;
    this[prop] = x1 + x2;
  }

  private toNumberString(n: number): string {
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

  private toNumber(nStr: string): number {
    try {
      nStr = nStr.split(' ').join('');
      nStr = nStr.replace(',', '.');
      return Number(nStr);
    } catch {
      return 0;
    }
  }

  private isEqual(a, b) {
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
