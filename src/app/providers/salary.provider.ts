import { Salary } from './../model/salary';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class SalaryProvider {
    private COLLECTION = 'salaries';

    constructor(
        private db: AngularFirestore
        ) {
    }

    public all(): Observable<Salary[]> {
        return this.db.collection<Salary>(this.COLLECTION).valueChanges();
    }

    public get(year: number): Observable<Salary> {
        return this.db.collection(this.COLLECTION).doc<Salary>(year.toString()).valueChanges();
    }

    public async set(salary: Salary) {
        return this.db.collection(this.COLLECTION).doc<Salary>(salary.year.toString()).set(salary.toObject());
    }

    public async delete(year: number) {
        return this.db.collection(this.COLLECTION).doc<Salary>(year.toString()).delete();
    }
}
