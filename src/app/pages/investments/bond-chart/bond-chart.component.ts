import { Investment } from './../../../model/investment';
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
  investments: Investment[];
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
    let bondData = [];
    const bondHeader = [];
    let intrestData = [];
    const intrestHeader = [];

    bondHeader.push('Month');
    for (const inv of this.investments) {
      bondHeader.push(inv.name);
    }
    bondHeader.push({ role: 'annotation' });
    bondHeader.push('Ack');
    bondData.push(bondHeader);

    intrestHeader.push('Month');
    intrestHeader.push('Bond Intrest');
    intrestHeader.push({ role: 'annotation' });
    intrestData.push(intrestHeader);

    let ack = 0;
    let intrest = 0;
    const months = this.getMonths(this.investments);
    for (const month of months) {
      const bondRow = [month];
      const intrestRow = [month];
      let total = 0;

      for (const inv of this.investments) {
        let amount = 0;
        for (const fin of inv.financing) {
          if (fin.month === month) {
            amount += fin.bond;
            intrest += fin.bond * inv.bondIntrestRate / 100 / 12;
          }
        }
        if (inv.hasPropertyDevelopment && inv.propertyDevelopment.endDate === month && inv.propertyDevelopment.salesPrice > 0) {
          amount -= inv.bond;
          intrest -= inv.bond * inv.bondIntrestRate / 100 / 12;
        }
        amount = Math.round(amount);
        ack += amount;
        total += amount;
        bondRow.push(amount);
      }
      intrestRow.push(Math.round(intrest));
      intrestRow.push(Math.round(intrest));
      intrestData.push(intrestRow);
      bondRow.push(total);
      bondRow.push(ack);
      bondData.push(bondRow);
    }
    const colNumber = (bondHeader.length - 3).toString();
    bondData = this.google.visualization.arrayToDataTable(bondData);

    const bondOptions = {
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
    bondOptions.series[colNumber] = {
      type: 'line'
    };

    const bondChart = new this.google.visualization.ComboChart(
      document.getElementById('bonds')
    );

    bondChart.draw(bondData, bondOptions);

    intrestData = this.google.visualization.arrayToDataTable(intrestData);

    const intrestOptions = {
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

    const intrestChart = new this.google.visualization.ColumnChart(
      document.getElementById('intrest')
    );

    intrestChart.draw(intrestData, intrestOptions);
  }

  private getMonths(investments: Investment[]) {
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
