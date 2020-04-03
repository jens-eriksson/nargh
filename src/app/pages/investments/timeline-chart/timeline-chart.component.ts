import { Investment } from './../../../model/investment';
import { InvestmentProvider } from './../../../providers/investment.provider';
import { ChartProvider } from './../../../providers/chart.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent implements OnInit {
  private google;
  investments: Investment[];

  constructor(
    private chartProvider: ChartProvider,
    private investmentProvider: InvestmentProvider
    ) {
      this.google = chartProvider.getGoogle();
      this.google.charts.load('current', {packages: ['timeline']});

      this.investmentProvider.all('name', 'asc').subscribe(investments => {
        this.investments = investments.filter(i => i.isFavourite && i.hasPropertyDevelopment);
        if (this.investments.length > 0) {
          this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
        }
      });
  }

  ngOnInit() {
  }

  private drawChart() {
    const container = document.getElementById('timeline');
    const chart = new this.google.visualization.Timeline(container);
    const dataTable = new this.google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'No' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    const data = [];
    let i = 1;

    for (const inv of this.investments) {
      const start = new Date(inv.propertyDevelopment.startDate);
      const months = start.getMonth() + inv.propertyDevelopment.timespan;
      const end = new Date(start);
      end.setMonth(months);

      data.push([i.toString(), inv.name, start, end]);

      i++;
    }
    dataTable.addRows(data);
    const options = {
      timeline: { singleColor: 'rgb(0, 123, 255)' }
    };
    chart.draw(dataTable, options);
  }

}
