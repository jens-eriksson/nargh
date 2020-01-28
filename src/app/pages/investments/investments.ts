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
  modalRef: BsModalRef;
  view = 'tiles';

  constructor(
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.view = localStorage.getItem('investments.view');
  }

  add() {
    this.modalService.show(InvestmentModal, {class: 'modal-xl', ignoreBackdropClick: true});
  }

  toggleView(view) {
    this.view = view;
    localStorage.setItem('investments.view', view);
  }
}
