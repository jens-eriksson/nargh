import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthenticationProvider {

    constructor(
        private afAuth: AngularFireAuth
        ) {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.setCurrentUser(user.uid);
            } else {
                this.removeCurrentUser();
            }
        });
    }

    private setCurrentUser(uid) {
        localStorage.setItem('uid', JSON.stringify(uid));
    }

    private removeCurrentUser() {
        localStorage.removeItem('uid');
    }

    public async signIn(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public async signOut() {
        return this.afAuth.auth.signOut();
    }

    public async registerUser(email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    public isAuthenticated(): boolean {
        const uid = JSON.parse(localStorage.getItem('uid'));
        if (uid) {
            return true;
        } else {
            return false;
        }
    }

    public currentUser(): string {
        return JSON.parse(localStorage.getItem('uid'));
    }
}
