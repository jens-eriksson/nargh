import { IInvestment } from '../../../model/investment';
import { InvestmentProvider } from '../../../providers/investment.provider';
import { ChartProvider } from '../../../providers/chart.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bond-chart',
  templateUrl: './bond-chart.component.html',
  styleUrls: ['./bond-chart.component.scss']
})
export class BondChartComponent implements OnInit {
  private google;
  investments: IInvestment[];
  data;

  constructor(
    private chartProvider: ChartProvider,
    private investmentProvider: InvestmentProvider
  ) {
    this.google = chartProvider.getGoogle();
    this.google.charts.load('current', { packages: ['corechart'] });

    this.investmentProvider.all('name', 'asc').subscribe(investments => {
      this.investments = investments.filter(i => i.isFavourite);
      this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
    });
  }

  ngOnInit() {}

  private drawChart() {
    let data = [];
    const header = [];
    const months = this.getMonths(this.investments);
    header.push('Month');
    for (const inv of this.investments) {
      header.push(inv.name);
    }
    header.push({ role: 'annotation' });
    header.push('Ack');

    data.push(header);
    let ack = 0;
    for (const month of months) {
      const row = [month];
      let total = 0;
      for (const inv of this.investments) {
        let amount = 0;
        for (const fin of inv.financing) {
          if (fin.month === month) {
            amount += fin.bond;
          }
        }
        amount = Math.round(amount);
        ack += amount;
        total += amount;
        row.push(amount);
      }
      row.push(total);
      row.push(ack);
      data.push(row);
    }
    const colNumber = (header.length - 3).toString();
    data = this.google.visualization.arrayToDataTable(data);

    const options = {
      height: 500,
      isStacked: true,
      legend: { position: 'top', maxLines: 3 },
      annotations: { alwaysOutside: true, highContrast: true },
      seriesType: 'bars',
      series: {},
      hAxis: {
        slantedText: true,
        slantedTextAngle: 60
      }
    };
    options.series[colNumber] = {
      type: 'line'
    };
    const chart = new this.google.visualization.ComboChart(
      document.getElementById('bonds')
    );
/*     const chart = new this.google.visualization.ColumnChart(
      document.getElementById('bonds')
    ); */
    chart.draw(data, options);
  }

  private getMonths(investments: IInvestment[]) {
    let months = [];
    for (const inv of investments) {
      if (inv.propertyDevelopment.startDate) {
        months.push(inv.propertyDevelopment.startDate);
      }
      if (inv.propertyDevelopment.endDate) {
        months.push(inv.propertyDevelopment.endDate);
      }
      if (inv.rentalBusiness.startDate) {
        months.push(inv.rentalBusiness.startDate);
      }
      if (inv.rentalBusiness.endDate) {
        months.push(inv.rentalBusiness.endDate);
      }
    }
    if (months.length === 0) {
      return months;
    }
    months.sort();

    const first = this.monthToNumber(months.shift());
    const last = this.monthToNumber(months.pop());

    months = [];
    for (let i = first; i <= last; i++) {
      const month = this.monthToString(i);
      if (!months.find(m => m === month)) {
        months.push(month);
      }
    }
    months.sort();
    return months;
  }

  private monthToNumber(date: string): number {
    if (date) {
      return (
        Number.parseInt(date.split('-')[0], 10) * 12 +
        Number.parseInt(date.split('-')[1], 10) - 1
      );
    } else {
      return 0;
    }
  }

  private monthToString(date: number) {
    const year = Math.floor(date / 12);
    let month = (date - year * 12 + 1).toString();
    if (month.length === 1) {
      month = '0' + month;
    }

    return year + '-' + month;
  }
}
