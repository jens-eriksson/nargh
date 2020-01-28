import { Component, OnInit, Input } from "@angular/core";
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
  propertyDevelopments: IInvestment[];
  rentalBusinesses: IInvestment[];
  modalRef: BsModalRef;
  deleteId: string = null;
  view = "investment-deal";

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.view = localStorage.getItem("investments.table.view");
    this.sortDevelopment();
    this.sortRental();
  }

  toogleFavourite(inv: IInvestment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
  }

  toogleView(view) {
    this.view = view;
    localStorage.setItem("investments.table.view", view);
  }

  sortDevelopment(orderBy?) {
    const key = "investments.table.sort.development";
    const sort = this.getSort(key, orderBy);
    const direction = sort.asc ? "asc" : "desc";

    this.investmentProvider
      .query("hasPropertyDevelopment", "==", true, sort.orderBy, direction)
      .subscribe(investments => {
        this.propertyDevelopments = investments;
        this.setSort(key, sort);
      });
  }

  sortRental(orderBy?) {
    const key = "investments.table.sort.rental";
    const sort = this.getSort(key, orderBy);
    const direction = sort.asc ? "asc" : "desc";

    this.investmentProvider
      .query("hasRentalBusiness", "==", true, sort.orderBy, direction)
      .subscribe(investments => {
        this.rentalBusinesses = investments;
        this.setSort(key, sort);
      });
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

    if(!sort) {
      sort = {
        orderBy: 'totalInvestment',
        asc: false
      }
    }

    return sort;
  }

  setSort(key, sort) {
    localStorage.setItem(key, JSON.stringify(sort));
  }
}
