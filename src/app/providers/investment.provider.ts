import { Investment } from './../model/investment';
import { WhereCondition } from './../model/where-condition';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class InvestmentProvider {
  private COLLECTION = 'investments';

  constructor(private db: AngularFirestore) {}

  public all(orderBy, direction): Observable<Investment[]> {
    return this.db
      .collection<Investment>(this.COLLECTION, ref =>
        ref.orderBy(orderBy, direction)
      )
      .valueChanges();
  }

  public get(id: string): Observable<Investment> {
    return this.db
      .collection(this.COLLECTION)
      .doc<Investment>(id)
      .valueChanges();
  }

  public query(
    conditions: WhereCondition[],
    orderBy,
    direction
  ): Observable<Investment[]> {
    return this.db
      .collection<Investment>(this.COLLECTION, ref => {
        let query = ref.orderBy(orderBy, direction);
        for (const c of conditions) {
          query = query.where(c.field, c.op, c.value);
        }
        return query;
      })
      .valueChanges();
  }

  public async set(investment: Investment) {
    if (investment.toObject) {
      investment = investment.toObject();
    }
    return this.db
      .collection(this.COLLECTION)
      .doc<Investment>(investment.id)
      .set(investment);
  }

  public async delete(id: string) {
    return this.db
      .collection(this.COLLECTION)
      .doc<Investment>(id)
      .delete();
  }

  public calculateCapital(investments: Investment[]) {
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
}
