import { ModalPageProvider } from './../../../providers/modal-page.provider';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Investment } from 'src/app/model/investment';
import { InvestmentProvider } from 'src/app/providers/investment.provider';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InvestmentPage } from '../../investment/investment';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  @Input() investments: Investment[];
  @Output() refresh = new EventEmitter<any>();
  modalRef: BsModalRef;
  deleteId: string = null;

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService,
    private modalPageProvider: ModalPageProvider
    ) { }

  ngOnInit() {
  }

  toogleFavourite(inv: Investment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
    this.refresh.emit();
  }

  edit(id) {
    this.modalPageProvider.open(InvestmentPage, { id });
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
