import { Component, OnInit, Input } from '@angular/core';
import { IInvestment } from 'src/app/model/investment';
import { InvestmentProvider } from 'src/app/providers/investment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InvestmentModal } from 'src/app/modal/investment/investment';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  investments: IInvestment[];
  modalRef: BsModalRef;
  deleteId: string = null;

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
    this.investmentProvider.all('isFavourite', 'desc').subscribe(investments => {
      this.investments = investments;
    });
  }

  toogleFavourite(inv: IInvestment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
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
