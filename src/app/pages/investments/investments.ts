import { InvestmentProvider } from './../../providers/investment';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NewInvestmentModal } from 'src/app/modal/new-investment/new-investment';
import { IInvestment } from 'src/app/model/investment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.html',
  styleUrls: ['./investments.scss']
})
export class InvestmentsPage implements OnInit {
  investments: IInvestment[];

  constructor(
    private modalService: BsModalService,
    private investmentProvider: InvestmentProvider
  ) {
  }

  ngOnInit() {
    this.investmentProvider.all().subscribe(investments => {
      this.investments = investments;
    })
  }

  add() {
    this.modalService.show(NewInvestmentModal, {class:'modal-lg'});
  }

  edit(id) {
    this.modalService.show(NewInvestmentModal, { initialState: { id }, class:'modal-lg' });
  }
}
