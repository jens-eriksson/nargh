import { ModalPageProvider } from './../../../providers/modal-page.provider';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Investment } from 'src/app/model/investment';
import { InvestmentProvider } from 'src/app/providers/investment.provider';
import { InvestmentPage } from '../../investment/investment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() investments: Investment[];
  @Output() refresh = new EventEmitter<any>();
  modalRef: BsModalRef;
  deleteId: string = null;
  showNonNav: boolean;

  constructor(
    private investmentProvider: InvestmentProvider,
    private modalService: BsModalService,
    private modalPageProvider: ModalPageProvider
  ) {}

  ngOnInit() {
  }

  toogleFavourite(inv: Investment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
    this.refresh.emit();
  }

  sort(orderBy) {
    this.refresh.emit(orderBy);
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
}
