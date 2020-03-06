import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserProfile } from './../model/user-profile';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class UserProfileProvider {
    private COLLECTION = 'userProfiles';

    constructor(
        private db: AngularFirestore
        ) {
    }

    public all(): Observable<UserProfile[]> {
        return this.db.collection<UserProfile>(this.COLLECTION).valueChanges();
    }

    public get(uid: string): Observable<UserProfile> {
        return this.db.collection(this.COLLECTION).doc<UserProfile>(uid).valueChanges();
    }

    public query(field, operator, condition): Observable<UserProfile[]> {
        return this.db.collection<UserProfile>(this.COLLECTION, ref => ref.where(field, operator, condition)).valueChanges();
    }

    public async set(userProfile: UserProfile) {
        return this.db.collection(this.COLLECTION).doc<UserProfile>(userProfile.uid).set(userProfile);
    }

    public async delete(uid: string) {
        return this.db.collection(this.COLLECTION).doc<UserProfile>(uid).delete();
    }
}
