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

    public all(): Observable<IInvestment[]> {
        return this.db.collection<IInvestment>(this.COLLECTION, ref => ref.orderBy('name')).valueChanges();
    }

    public get(id: string): Observable<IInvestment> {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(id).valueChanges();
    }

    public query(field, operator, condition): Observable<IInvestment[]> {
        return this.db.collection<IInvestment>(this.COLLECTION, ref => ref.where(field, operator, condition)).valueChanges();
    }

    public async set(investment: IInvestment) {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(investment.id).set(investment);
    }

    public async delete(id: string) {
        return this.db.collection(this.COLLECTION).doc<IInvestment>(id).delete();
    }
}
