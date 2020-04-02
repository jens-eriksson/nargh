import { UtilProvider } from './util.provider';
import { Forecast } from './../model/forecast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IInvestment } from '../model/investment';
import { Asset } from '../model/asset';
import { Observable } from 'rxjs';

@Injectable()
export class ForecastProvider {
    private COLLECTION = 'forecasts';

    constructor(
        private db: AngularFirestore,
        private util: UtilProvider
        ) {
    }

    public all(): Observable<Forecast[]> {
        return this.db.collection<Forecast>(this.COLLECTION).valueChanges();
    }

    public get(year: number): Observable<Forecast> {
        return this.db.collection(this.COLLECTION).doc<Forecast>(year.toString()).valueChanges();
    }

    public async set(forecast: Forecast) {
        if (forecast.toObject) {
            forecast = forecast.toObject();
        }
        return this.db.collection(this.COLLECTION).doc<Forecast>(forecast.year.toString()).set(forecast);
    }

    public async delete(year: number) {
        return this.db.collection(this.COLLECTION).doc<Forecast>(year.toString()).delete();
    }

    public update(forecast: Forecast, investments: IInvestment[]): Forecast {
        const startMonth = forecast.year * 12;
        const endMonth = forecast.year * 12 + 11;
        forecast.assets = [];

        for (const inv of investments) {
            const asset: Asset = {
                name: inv.name,
                value: 0,
                bankLoan: 0,
                bond: 0,
                equity: 0,
                bankIntrest: 0,
                bondIntrest: 0,
                revenue: 0,
                operatingCost: 0,
                netIncome: 0
            }

            if (this.util.monthToNumber(inv.propertyDevelopment.endDate) >= startMonth && this.util.monthToNumber(inv.propertyDevelopment.endDate) <= endMonth && inv.propertyDevelopment.salesPrice > 0) {
                asset.netIncome = inv.propertyDevelopment.salesPrice - inv.totalInvestment;
            }

            for (let month = startMonth; month <= endMonth; month++) {
                asset.bankIntrest += this.util.getBankLoanAmount(inv, this.util.monthToString(month)) * inv.bankIntrestRate / 100 / 12;
                asset.bondIntrest += this.util.getBondAmount(inv, this.util.monthToString(month)) * inv.bondIntrestRate / 100 / 12;

                if (inv.hasRentalBusiness) {
                    let rentalStartMonth = 0;
                    if (inv.rentalBusiness.startDate) {
                        rentalStartMonth = this.util.monthToNumber(inv.rentalBusiness.startDate);
                    }
                    let rentalEndMonth = Infinity;
                    if (inv.rentalBusiness.endDate) {
                        rentalEndMonth = this.util.monthToNumber(inv.rentalBusiness.endDate);
                    }
                    if (rentalStartMonth <= month && rentalEndMonth >= month) {
                        asset.revenue += inv.rentalBusiness.revenue / 12;
                        asset.operatingCost += inv.rentalBusiness.operatingCost / 12;
                    }
                }
            }

            asset.bankLoan = this.util.getBankLoanAmount(inv, this.util.monthToString(endMonth));
            asset.bond = this.util.getBondAmount(inv, this.util.monthToString(endMonth));
            asset.equity = this.util.getEquityAmount(inv, this.util.monthToString(endMonth));
            asset.value = asset.bankLoan + asset.bond + asset.equity;

            if (asset.value > 0 || asset.netIncome > 0) {
                forecast.assets.push(asset);
            }
        }

        forecast.incomeStatement.rentalBusiness.revenue = 0;
        forecast.incomeStatement.rentalBusiness.operatingCost = 0;
        forecast.incomeStatement.rentalBusiness.bankIntrest = 0;
        forecast.incomeStatement.rentalBusiness.bondIntrest = 0;
        forecast.incomeStatement.propertyDevelopment.netIncome = 0;
        forecast.balanceSheet.assets = 0;
        forecast.balanceSheet.bankLoan = 0;
        forecast.balanceSheet.bonds = 0;

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
                                                            forecast.incomeStatement.rentalBusiness.bondIntrest -
                                                            forecast.incomeStatement.rentalBusiness.salaries;

        forecast.incomeStatement.netIncome = forecast.incomeStatement.rentalBusiness.netIncome +
                                             forecast.incomeStatement.propertyDevelopment.netIncome;

        forecast.balanceSheet.equity = forecast.balanceSheet.assets -
                                       forecast.balanceSheet.bankLoan - forecast.balanceSheet.bonds;

        return forecast;
    }

    public create(year: number, salary: number, investments: IInvestment[]): Forecast {
        const forecast = new Forecast();
        forecast.year = year;
        forecast.incomeStatement.rentalBusiness.salaries = salary;

        return this.update(forecast, investments);
    }
}

