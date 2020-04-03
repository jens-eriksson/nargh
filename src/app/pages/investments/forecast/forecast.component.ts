import { UtilProvider } from './../../../providers/util.provider';
import { Salary } from './../../../model/salary';
import { ForecastProvider } from './../../../providers/forecast.provider';
import { SalaryProvider } from './../../../providers/salary.provider';
import { Component, OnInit } from '@angular/core';
import { InvestmentProvider } from '../../../providers/investment.provider';
import { Forecast } from 'src/app/model/forecast';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {
  investments = [];
  forecasts: Forecast[] = [];
  salaries = {};

  constructor(
    private investmentProvider: InvestmentProvider,
    private forecastProvider: ForecastProvider,
    private salaryProvider: SalaryProvider,
    private util: UtilProvider) { }

  ngOnInit() {
    this.forecastProvider.all().subscribe(forecasts => {
      this.forecasts = forecasts;
    });

    this.investmentProvider.all('name', 'asc').subscribe(investments => {
      this.investments = investments.filter(i => i.isFavourite);
      for (const forecast of this.forecasts) {
        this.forecastProvider.update(forecast, this.investments);
        this.forecastProvider.set(forecast);
      }
    });
  }

  salaryChange(forecast: Forecast) {
    this.forecastProvider.update(forecast, this.investments);
    this.forecastProvider.set(forecast);
  }
}
