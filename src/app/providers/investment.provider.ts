import { IInvestment } from "./../model/investment";
import { WhereCondition } from "./../model/where-condition";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable()
export class InvestmentProvider {
  private COLLECTION = "investments";

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
    const endYear = year + 5;

    for (year; year <= endYear; year++) {
      const forecast = {
        year: year,
        incomeStatement: {
            propertyDevelopment: {
                netIncome: 0
            },
            rentalBusiness: {
                assets: [],
                revenue: 0,
                operatingCost: 0,
                bankIntrest: 0,
                netIncome: 0
            }
        }
      };

      let startMonth = year * 12 + 1;
      const endMonth = year * 12 + 12;

      for (let inv of investments) {
        console.log(inv.name +':loanShare:'+ inv.loanShare);
        console.log(inv.name +':bankRate:'+ inv.bankIntrestRate);
        let invAmount = 0;
        for (let month = startMonth; month <= endMonth; month++) {
            for(let i of inv.investments) {
                let m = this.monthToString(month);
                if(i.date === m) {
                  invAmount += i.amount;
                  console.log(inv.name + ':' + i.date + ':' + invAmount);
                }
            }
            
            if (inv.hasRentalBusiness) {
                let rentalStartMonth = 0;
                if (inv.rentalBusiness.startDate) {
                rentalStartMonth = this.monthToNumber(
                    inv.rentalBusiness.startDate
                );
                }
                let rentalEndMonth = Infinity;
                if (inv.rentalBusiness.endDate) {
                rentalEndMonth = this.monthToNumber(inv.rentalBusiness.endDate);
                }

                if (rentalStartMonth <= month && rentalEndMonth >= month) {
                const asset = forecast.incomeStatement.rentalBusiness.assets.find(a => a.name === inv.name);
                if (asset) {
                    asset.revenue += inv.rentalBusiness.revenue / 12;
                } else {
                    forecast.incomeStatement.rentalBusiness.assets.push({
                    name: inv.name,
                    revenue: inv.rentalBusiness.revenue / 12
                    });
                }
                forecast.incomeStatement.rentalBusiness.revenue += inv.rentalBusiness.revenue / 12;
                forecast.incomeStatement.rentalBusiness.operatingCost += inv.rentalBusiness.operatingCost / 12;
                forecast.incomeStatement.rentalBusiness.bankIntrest += invAmount * inv.loanShare * inv.bankIntrestRate / 12;
            }
          }
        }
      }

      forecasts.push(forecast);
    }

    return forecasts;
  }

  private monthToNumber(date: string): number {
    return (
      Number.parseInt(date.split("-")[0], 10) * 12 +
      Number.parseInt(date.split("-")[1], 10)
    );
  }

  private monthToString(date: number) {
    let year = Math.floor(date / 12);
    let month = (date - year * 12 + 1).toString();
    if (month.length === 1) {
      month = "0" + month;
    }

    return year + "-" + month;
  }
}
