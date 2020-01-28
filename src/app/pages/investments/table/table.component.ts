import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { IInvestment } from "src/app/model/investment";
import { InvestmentProvider } from "src/app/providers/investment";
import { InvestmentModal } from "src/app/modal/investment/investment";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  investments: IInvestment[];
  rentalBusinesses: IInvestment[];
  modalRef: BsModalRef;
  deleteId: string = null;
  view = "investment-deal";
  filter = 'all';
  showRental = true;
  showDevelopment = true;

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.view = localStorage.getItem("investments.table.view");
    this.data();
  }

  toogleFavourite(inv: IInvestment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
  }

  toogleView(view) {
    this.view = view;
    localStorage.setItem("investments.table.view", view);
  }

  data(orderBy?) {
    const key = "investments.table.sort";
    const sort = this.getSort(key, orderBy);
    const direction = sort.asc ? "asc" : "desc";

    if(this.filter == 'all') {
      this.investmentProvider
      .all(sort.orderBy, direction)
      .subscribe(investments => {
        this.investments = investments;
        this.setSort(key, sort);
      });
    }
    
    if(this.filter == 'development') {
      this.investmentProvider
      .query('hasPropertyDevelopment', '==', true, sort.orderBy, direction)
      .subscribe(investments => {
        this.investments = investments;
        this.setSort(key, sort);
      });
    }
    
    if(this.filter == 'rental') {
      this.investmentProvider
      .query('hasRentalBusiness', '==', true, sort.orderBy, direction)
      .subscribe(investments => {
        this.investments = investments;
        this.setSort(key, sort);
      });
    }
  }

  setFilter(filter) {
    this.filter = filter;
    this.data();
  }

  edit(id) {
    this.modalService.show(InvestmentModal, {
      initialState: { id },
      class: "modal-xl",
      ignoreBackdropClick: true
    });
  }

  confirmDelete(template, id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
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

  getSort(key, orderBy?) {
    let sort = JSON.parse(localStorage.getItem(key));
    if (orderBy) {
      let asc = true;
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
        orderBy: "totalInvestment",
        asc: false
      };
    }

    return sort;
  }

  setSort(key, sort) {
    localStorage.setItem(key, JSON.stringify(sort));
  }

  showRentalChange() {
    if (!this.showDevelopment && !this.showRental) {
      this.showDevelopment = true;
    }
  }

  showDevelopmentChange() {
    if (!this.showDevelopment && !this.showRental) {
      this.showRental = true;
    }
  }
}
