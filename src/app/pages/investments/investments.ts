import { ModalPageProvider } from './../../providers/modal-page.provider';
import { Component, OnInit } from '@angular/core';
import { InvestmentPage } from '../investment/investment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.html',
  styleUrls: ['./investments.scss']
})
export class InvestmentsPage implements OnInit {
  view;
  showOnlyFavourites = false;

  constructor(
    private modalPageProvider: ModalPageProvider
  ) {
  }

  ngOnInit() {
    this.view = localStorage.getItem('investments.view');
    if (!this.view) {
      this.view = 'tiles';
    }
  }

  add() {
    this.modalPageProvider.open(InvestmentPage);
  }

  toggleView(view) {
    this.view = view;
    localStorage.setItem('investments.view', view);
  }

  toggleFavourite() {
    this.showOnlyFavourites = !this.showOnlyFavourites;
  }
}
