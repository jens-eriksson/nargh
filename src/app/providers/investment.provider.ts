import { IInvestment } from './../model/investment';
import { WhereCondition } from './../model/where-condition';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class InvestmentProvider {
  private COLLECTION = 'investments';

  constructor(private db: AngularFirestore) {}

  public all(orderBy, direction): Observable<IInvestment[]> {
    return this.db
      .collection<IInvestment>(this.COLLECTION, ref =>
        ref.orderBy(orderBy, direction)
      )
      .valueChanges();
  }

  public get(id: string): Observable<IInvestment> {
    return this.db
      .collection(this.COLLECTION)
      .doc<IInvestment>(id)
      .valueChanges();
  }

  public query(
    conditions: WhereCondition[],
    orderBy,
    direction
  ): Observable<IInvestment[]> {
    return this.db
      .collection<IInvestment>(this.COLLECTION, ref => {
        let query = ref.orderBy(orderBy, direction);
        for (const c of conditions) {
          query = query.where(c.field, c.op, c.value);
        }
        return query;
      })
      .valueChanges();
  }

  public async set(investment: IInvestment) {
    return this.db
      .collection(this.COLLECTION)
      .doc<IInvestment>(investment.id)
      .set(investment);
  }

  public async delete(id: string) {
    return this.db
      .collection(this.COLLECTION)
      .doc<IInvestment>(id)
      .delete();
  }

  public calculateCapital(investments: IInvestment[]) {
    const capital = {
      totalInvestment: 0,
      bankLoan: 0,
      bond: 0
    };
    for (const inv of investments) {
      if (inv.isFavourite) {
        capital.totalInvestment += inv.totalInvestment;
        capital.bankLoan += inv.bankLoan;
        capital.bond += inv.bond;
      }
    }
    return capital;
  }

  public calculateForecast(investments: IInvestment[]) {
    const forecasts = [];
    let year = new Date().getFullYear();
    const endYear = year + 2;

    for (year; year <= endYear; year++) {
      const forecast = {
        year: year,
        assets: [],
        incomeStatement: {
            propertyDevelopment: {
                netIncome: 0
            },
            rentalBusiness: {
                revenue: 0,
                operatingCost: 0,
                bankIntrest: 0,
                bondIntrest: 0,
                netIncome: 0
            },
            netIncome: 0
        },
        balanceSheet: {
          assets: 0,
          bankLoan: 0,
          bonds: 0,
          equity: 0
        }
      };

      const startMonth = year * 12;
      const endMonth = year * 12 + 12;

      for (const inv of investments) {
        const asset  = {
          name: inv.name,
          value: 0,
          bankLoan: 0,
          bond: 0,
          equity: 0,
          revenue: 0,
          operatingCost: 0,
          bankIntrest: 0,
          bondIntrest: 0,
          netIncome: 0
        };

        if (this.monthToNumber(inv.propertyDevelopment.endDate) >= startMonth && this.monthToNumber(inv.propertyDevelopment.endDate) <= endMonth && inv.propertyDevelopment.salesPrice > 0) {
          asset.netIncome = inv.propertyDevelopment.salesPrice - inv.totalInvestment;
        }

        for (let month = startMonth; month < endMonth; month++) {
          asset.bankIntrest += this.getBankLoanAmount(inv, this.monthToString(month)) * inv.bankIntrestRate / 100 / 12;
          asset.bondIntrest += this.getBondAmount(inv, this.monthToString(month)) * inv.bondIntrestRate / 100 / 12;

          if (inv.hasRentalBusiness) {
            let rentalStartMonth = 0;
            if (inv.rentalBusiness.startDate) {
              rentalStartMonth = this.monthToNumber(inv.rentalBusiness.startDate);
            }
            let rentalEndMonth = Infinity;
            if (inv.rentalBusiness.endDate) {
              rentalEndMonth = this.monthToNumber(inv.rentalBusiness.endDate);
            }
            if (rentalStartMonth <= month && rentalEndMonth >= month) {
              asset.revenue += inv.rentalBusiness.revenue / 12;
              asset.operatingCost += inv.rentalBusiness.operatingCost / 12;
            }
          }
        }

        asset.bankLoan = this.getBankLoanAmount(inv, this.monthToString(endMonth));
        asset.bond = this.getBondAmount(inv, this.monthToString(endMonth));
        asset.equity = this.getEquityAmount(inv, this.monthToString(endMonth));
        asset.value = asset.bankLoan + asset.bond + asset.equity;

        if (asset.value > 0 || asset.netIncome > 0) {
          forecast.assets.push(asset);
        }
      }

      for (const a of forecast.assets) {
        forecast.incomeStatement.rentalBusiness.revenue += a.revenue;
        forecast.incomeStatement.rentalBusiness.operatingCost += a.operatingCost;
        forecast.incomeStatement.rentalBusiness.bankIntrest += a.bankIntrest;
        forecast.incomeStatement.rentalBusiness.bondIntrest += a.bondIntrest;
        forecast.incomeStatement.propertyDevelopment.netIncome += a.netIncome;
        forecast.balanceSheet.assets += a.value;
        forecast.balanceSheet.bankLoan += a.bankLoan;
        forecast.balanceSheet.bonds += a.bond;
      }

      forecast.incomeStatement.rentalBusiness.netIncome = forecast.incomeStatement.rentalBusiness.revenue -
                                                          forecast.incomeStatement.rentalBusiness.operatingCost -
                                                          forecast.incomeStatement.rentalBusiness.bankIntrest -
                                                          forecast.incomeStatement.rentalBusiness.bondIntrest;
      forecast.incomeStatement.netIncome = forecast.incomeStatement.rentalBusiness.netIncome + forecast.incomeStatement.propertyDevelopment.netIncome;
      forecast.balanceSheet.equity = forecast.balanceSheet.assets - forecast.balanceSheet.bankLoan - forecast.balanceSheet.bonds;
      forecasts.push(forecast);
    }

    return forecasts;
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

  private getBondAmount(investment: IInvestment, month) {
    if (!month) {
      return 0;
    }
    month = this.monthToNumber(month);
    let salesMonth = Infinity;
    if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
      salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
    }
    let amount = 0;
    if (salesMonth >= month) {
      for (const fin of investment.financing) {
        if (this.monthToNumber(fin.month) <= month) {
          amount += fin.bond;
        }
      }
    }
    return amount;
  }

  private getBankLoanAmount(investment: IInvestment, month) {
    if (!month) {
      return 0;
    }
    month = this.monthToNumber(month);
    let salesMonth = Infinity;
    if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
      salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
    }
    let amount = 0;
    if (salesMonth >= month) {
      for (const fin of investment.financing) {
        if (this.monthToNumber(fin.month) <= month) {
          amount += fin.bankLoan;
        }
      }
    }
    return amount;
  }

  private getEquityAmount(investment: IInvestment, month) {
    if (!month) {
      return 0;
    }
    month = this.monthToNumber(month);
    let salesMonth = Infinity;
    if (investment.propertyDevelopment.endDate && investment.propertyDevelopment.salesPrice > 0) {
      salesMonth = this.monthToNumber(investment.propertyDevelopment.endDate);
    }
    let amount = 0;
    if (salesMonth >= month) {
      for (const fin of investment.financing) {
        if (this.monthToNumber(fin.month) <= month) {
          amount += fin.equity;
        }
      }
    }
    return amount;
  }
}
