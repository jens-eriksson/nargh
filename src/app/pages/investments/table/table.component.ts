import { ModalPageProvider } from './../../../providers/modal-page.provider';
import { WhereCondition } from './../../../model/where-condition';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IInvestment } from 'src/app/model/investment';
import { InvestmentProvider } from 'src/app/providers/investment.provider';
import { InvestmentPage } from '../../investment/investment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  private readonly SORT_KEY = 'investments.table.sort';
  private readonly FILTER_KEY = 'investments.table.filter';
  subscription;
  investments: IInvestment[];
  modalRef: BsModalRef;
  deleteId: string = null;
  showNonNav: boolean;

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService,
    private modalPageProvider: ModalPageProvider
  ) {}

  ngOnInit() {
    this.data();
  }

  toogleFavourite(inv: IInvestment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
    this.data();
  }

  data(orderBy?) {
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

  filterArea(area) {
    const filter = this.getFilter();
    filter.area = area;
    this.setFilter(filter);
    this.data();
  }

  filterNonFav() {
    const filter = this.getFilter();
    filter.showNonFav = !filter.showNonFav;
    this.setFilter(filter);
    this.data();
  }

  edit(id) {
    this.modalPageProvider.open(InvestmentPage, { id: id });
  }

  confirmDelete(template, id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true
    });
  }

  delete() {
    if (this.deleteId) {
      this.investmentProvider.delete(this.deleteId);
      this.deleteId = null;
    }

    this.modalRef.hide();
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

  getFilter() {
    let filter = JSON.parse(localStorage.getItem(this.FILTER_KEY));
    if (!filter) {
      filter = {
        area: 'all',
        showNonFav: true
      };
    }
    this.showNonNav = filter.showNonFav;
    return filter;
  }

  setFilter(filter) {
    localStorage.setItem(this.FILTER_KEY, JSON.stringify(filter));
  }
}
