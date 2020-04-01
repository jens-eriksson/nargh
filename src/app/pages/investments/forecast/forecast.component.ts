import { Component, OnInit } from '@angular/core';
import { InvestmentProvider } from 'src/app/providers/investment.provider';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {
  forecasts;
  years = [];

  constructor(private investmentProvider: InvestmentProvider) { }

  ngOnInit() {
    this.investmentProvider.all('name', 'asc').subscribe(investments => {
      this.forecasts = this.investmentProvider.calculateForecast(investments.filter(i => i.isFavourite));
      this.years = [];
      for (const forecast of this.forecasts) {
        this.years.push(forecast.year);
      }
    });
  }
}
