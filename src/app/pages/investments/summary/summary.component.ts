import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @Input()
  totalInvestment;
  @Input()
  equity: number;
  @Input()
  netIncomeInvestment: number;
  @Input()
  netIncomeRental: number;
  @Input()
  timespan: number;

  constructor() { }

  ngOnInit() {
  }

}
