import { Component, OnInit } from '@angular/core';
import { InvestmentProvider } from 'src/app/providers/investment.provider';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  capital;

  constructor(private investmentProvider: InvestmentProvider) { }

  ngOnInit() {
    this.investmentProvider.all('name', 'asc').subscribe(investments => {
      this.capital = this.investmentProvider.calculateCapital(investments);
    });
  }
}
