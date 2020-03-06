import { IInvestment } from "../../../model/investment";
import { InvestmentProvider } from "../../../providers/investment.provider";
import { ChartProvider } from "../../../providers/chart.provider";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-bond-chart",
  templateUrl: "./bond-chart.component.html",
  styleUrls: ["./bond-chart.component.scss"]
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
    this.google.charts.load("current", { packages: ["corechart"] });

    this.investmentProvider.all("dealDate", "asc").subscribe(investments => {
      this.investments = investments.filter(i => i.isFavourite);
      this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
    });
  }

  ngOnInit() {}

  private drawChart() {
    let data = [];
    const header = [];
    const months = [];
    header.push("Month");
    for (const inv of this.investments) {
      header.push(inv.name);
      for (const invDate of inv.investments) {  
        if (!months.find(m => m === invDate.date)) {
          months.push(invDate.date);
        }
      }
    }
    months.sort();
    header.push({ role: "annotation" });

    data.push(header);
    for (const month of months) {
      const row = [month];
      let total = 0;
      for (const inv of this.investments) {
        let amount = 0;
        for (const invDate of inv.investments) {
          if (invDate.date == month) {
            amount += invDate.amount * inv.bondShare;
          }
        }
        amount = Math.round(amount);
        total += amount;
        row.push(amount);
      }
      row.push(total);
      data.push(row);
    }

    data = this.google.visualization.arrayToDataTable(data);

    const options = {
      height: 500,
      isStacked: true,
      legend: { position: "top", maxLines: 3 },
      annotations: { alwaysOutside: true, highContrast: true }
    };
    const chart = new this.google.visualization.ColumnChart(
      document.getElementById("bonds")
    );
    chart.draw(data, options);
  }
}
