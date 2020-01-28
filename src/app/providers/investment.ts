import { IInvestment } from './../model/investment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class InvestmentProvider {
    private COLLECTION = 'investments';

    constructor(
        private db: AngularFirestore
        ) {
    }

    public all(orderBy, direction): Observable<IInvestment[]> {
        return this.db.collection<IInvestment>(this.COLLECTION, ref => ref.orderBy(orderBy, direction)).valueChanges();
    }

    public get(id: string): Observable<IInvestment> {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(id).valueChanges();
    }

    public query(field, operator, condition, orderBy, direction): Observable<IInvestment[]> {
        return this.db.collection<IInvestment>(this.COLLECTION, ref => ref.where(field, operator, condition).orderBy(orderBy, direction)).valueChanges();
    }

    public async set(investment: IInvestment) {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(investment.id).set(investment);
    }

    public async delete(id: string) {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(id).delete();
    }

    public calculateSummary(investments: IInvestment[]) {
        let summary = {
            totalInvestment: 0,
            equity: 0,
            netIncomeDevelopment: 0,
            netIncomeRental: 0,
            timespan: 0,
            favCount: 0
        };

        for (const inv of investments) {
          if (inv.isFavourite) {
            summary.totalInvestment += inv.totalInvestment;
            summary.equity += inv.equity;
            summary.netIncomeDevelopment += inv.propertyDevelopment.netIncome;
            summary.netIncomeRental += inv.rentalBusiness.netIncome;
            summary.timespan += inv.propertyDevelopment.timespan;
            summary.favCount++;
          }
        }

        return summary;
    }
    
}
