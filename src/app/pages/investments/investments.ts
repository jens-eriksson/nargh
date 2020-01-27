import { InvestmentProvider } from './../../providers/investment';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InvestmentModal } from 'src/app/modal/investment/investment';
import { IInvestment } from 'src/app/model/investment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.html',
  styleUrls: ['./investments.scss']
})
export class InvestmentsPage implements OnInit {
  investments: IInvestment[];
  totalInvestment: number;
  equity: number;
  netIncomeInvestment: number; 
  netIncomeRental: number;
  timespan: number;

  modalRef: BsModalRef;
  deleteId: string = null;

  constructor(
    private modalService: BsModalService,
    private investmentProvider: InvestmentProvider
  ) {
  }

  ngOnInit() {
    this.investmentProvider.all().subscribe(investments => {
      this.investments = investments;
      this.calculate();
    });
  }

  calculate() {
    this.totalInvestment = 0;
    this.equity = 0;
    this.netIncomeInvestment = 0;
    this.netIncomeRental = 0;
    this.timespan = 0;
    for (const inv of this.investments) {
      if (inv.isFavourite) {
        this.totalInvestment += inv.totalInvestment;
        this.equity += inv.equity;
        this.netIncomeInvestment += inv.investmentDeal.netIncome;
        this.netIncomeRental += inv.rentalBusiness.netIncome;
        this.timespan += inv.investmentDeal.timespan;
      }
    }
  }

  add() {
    this.modalService.show(InvestmentModal, {class: 'modal-xl', ignoreBackdropClick: true});
  }

  edit(id) {
    this.modalService.show(InvestmentModal, { initialState: { id }, class: 'modal-xl', ignoreBackdropClick: true });
  }

  confirmDelete(template, id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true});
  }

  delete() {
    if (this.deleteId) {
      this.investmentProvider.delete(this.deleteId);
      this.deleteId = null;
    }

    this.modalRef.hide();
  }
}
