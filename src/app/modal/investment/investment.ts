import { InvestmentProvider } from '../../providers/investment';
import { Investment, IInvestment } from '../../model/investment';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.html',
  styleUrls: ['./investment.scss']
})
export class InvestmentModal implements OnInit {
  id: string;
  investment: Investment = new Investment();
  timespan: string;
  totalInvestment: string;
  equity: string;
  intrestRate: string;
  salesPrice: string;
  revenue: string;
  operatingCost: string;

  constructor(
    private bsModalRef: BsModalRef,
    private investmentProvider: InvestmentProvider
    ) {
  }

  ngOnInit() {
    if (this.id) {
      this.investmentProvider.get(this.id).subscribe(investment => {
        this.investment.fromObject(investment);
        this.timespan = this.toNumberString(investment.investmentDeal.timespan);
        this.totalInvestment = this.toNumberString(investment.totalInvestment);
        this.equity = this.toNumberString(investment.equity);
        this.intrestRate = this.toNumberString(investment.intrestRate);
        this.salesPrice = this.toNumberString(investment.investmentDeal.salesPrice);
        this.revenue = this.toNumberString(investment.rentalBusiness.revenue);
        this.operatingCost = this.toNumberString(investment.rentalBusiness.operatingCost);
      });
    }
  }

  ok(form: NgForm) {
    if (form.valid) {
      this.investment.generateId();
      this.investmentProvider.set(this.investment.toObject()).then(() => {
        this.bsModalRef.hide();
      });
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

  timespanChange(timespan) {
    this.investment.investmentDeal.timespan = this.toNumber(timespan);
    this.timespan = this.toNumberString(this.investment.investmentDeal.timespan);
    this.investment.calculate();
  }

  totalInvestmentChange(totalInvestment) {
    this.investment.totalInvestment = this.toNumber(totalInvestment);
    this.totalInvestment = this.toNumberString(this.investment.totalInvestment);
    this.investment.calculate();
  }

  equityChange(equity) {
    this.investment.equity = this.toNumber(equity);
    this.equity = this.toNumberString(this.investment.equity);
    this.investment.calculate();
  }

  intrestRateChange(intrestRate) {
    if (!intrestRate.endsWith('.')) {
      this.investment.intrestRate = this.toNumber(intrestRate);
      this.intrestRate = this.toNumberString(this.investment.intrestRate);
      this.investment.calculate();
    }
  }

  salesPriceChange(salesPrice) {
    this.investment.investmentDeal.salesPrice = this.toNumber(salesPrice);
    this.salesPrice = this.toNumberString(this.investment.investmentDeal.salesPrice);
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

  hasInvestmentDealChange() {
    console.log(this.investment.hasInvestmentDeal);
    if (!this.investment.hasInvestmentDeal) {
      this.investment.investmentDeal.salesPrice = null;
      this.salesPrice =  null;
      this.investment.investmentDeal.timespan = null;
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

  private toNumberString(n: number): string {
    try {
      if (n === 0) {
        return null;
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
      return null;
    }
  }
}
