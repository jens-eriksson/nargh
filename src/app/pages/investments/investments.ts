import { InvestmentProvider } from 'src/app/providers/investment.provider';
import { WhereCondition } from './../../model/where-condition';
import { Investment } from 'src/app/model/investment';
import { ModalPageProvider } from './../../providers/modal-page.provider';
import { Component, OnInit } from '@angular/core';
import { InvestmentPage } from '../investment/investment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.html',
  styleUrls: ['./investments.scss']
})
export class InvestmentsPage implements OnInit {
  private readonly SORT_KEY = 'investments.sort';
  private readonly FILTER_KEY = 'investments.filter';
  subscription;
  investments: Investment[];
  view;
  showOnlyFavourites = false;

  constructor(
    private modalPageProvider: ModalPageProvider,
    private investmentProvider: InvestmentProvider,
  ) {
  }

  ngOnInit() {
    this.view = localStorage.getItem('investments.view');
    if (!this.view) {
      this.view = 'tiles';
    }
    this.getData();
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

  filter() {
    const filter = this.getFilter();
    filter.showNonFav = !filter.showNonFav;
    this.setFilter(filter);
    this.getData();
  }

  getFilter() {
    let filter = JSON.parse(localStorage.getItem(this.FILTER_KEY));
    if (!filter) {
      filter = {
        area: 'all',
        showNonFav: true
      };
    }
    this.showOnlyFavourites = !filter.showNonFav;
    return filter;
  }

  setFilter(filter) {
    localStorage.setItem(this.FILTER_KEY, JSON.stringify(filter));
  }

  getSort(orderBy?) {
    let sort = JSON.parse(localStorage.getItem(this.SORT_KEY));
    if (orderBy) {
      let asc = false;
      if (sort && sort.orderBy === orderBy) {
        asc = !sort.asc;
      }
      sort = {
        orderBy: orderBy,
        asc: asc
      };
    }

    if (!sort) {
      sort = {
        orderBy: 'totalInvestment',
        asc: false
      };
    }

    return sort;
  }

  setSort(sort) {
    localStorage.setItem(this.SORT_KEY, JSON.stringify(sort));
  }

  getData(orderBy?) {
    const sort = this.getSort(orderBy);
    const filter = this.getFilter();
    const direction = sort.asc ? 'asc' : 'desc';

    const conditions: WhereCondition[] = [];

    if (filter.area === 'development') {
      conditions.push({
        field: 'hasPropertyDevelopment',
        op: '==',
        value: true
      });
    }

    if (filter.area === 'rental') {
      conditions.push({
        field: 'hasRentalBusiness',
        op: '==',
        value: true
      });
    }

    if (!filter.showNonFav) {
      conditions.push({
        field: 'isFavourite',
        op: '==',
        value: true
      });
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.investmentProvider
      .query(conditions, sort.orderBy, direction)
      .subscribe(investments => {
        this.investments = investments;
        this.setSort(sort);
      });
  }
}
