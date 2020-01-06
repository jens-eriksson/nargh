import { InvestmentProvider } from './../../providers/investment';
import { Investment, IInvestment } from './../../model/investment';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-investment',
  templateUrl: './new-investment.html',
  styleUrls: ['./new-investment.scss']
})
export class NewInvestmentModal implements OnInit {
  id: string;
  deal: Investment = new Investment();
  password: string;

  constructor(
    private bsModalRef: BsModalRef,
    private investmentProvider: InvestmentProvider
    ) {
  }

  ngOnInit() {
    if (this.id) {
      this.investmentProvider.get(this.id).subscribe(investment => {
        this.deal.fromObject(investment);
      })
    }
  }

  calculate() {
    this.deal.calculate();
  }

  ok(form: NgForm) {    
    if(form.valid) {
      this.investmentProvider.set(this.deal.toObject()).then(() => {
        this.bsModalRef.hide();
      })
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

  private integerInputCheck($event): boolean {
    if($event.code == 'Space') {
      return false;
    }

    if(!isNaN($event.key) || $event.code == 'Backspace' || $event.code == 'ArrowLeft' || $event.code == 'ArrowRight' || $event.code == 'Tab') {
      return true;
    }

    return false;
  }

  private floatInputCheck($event): boolean {
    if($event.code == 'Space') {
      return false;
    }

    if(
      !isNaN($event.key) || $event.code == 'Backspace' || $event.code == 'ArrowLeft' || $event.code == 'ArrowRight' || $event.code == 'Tab' || $event.code == 'Period') {
      return true;
    }

    return false;
  }
}
