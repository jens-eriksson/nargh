import { Component, OnInit, Input } from '@angular/core';
import { IInvestment } from 'src/app/model/investment';
import { InvestmentProvider } from 'src/app/providers/investment';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  @Input()
  investments;

  constructor(private investmentProvider: InvestmentProvider) { }

  ngOnInit() {
  }

  toogleFavourite(inv: IInvestment) {
    inv.isFavourite = !inv.isFavourite;
    this.investmentProvider.set(inv);
  }

}
