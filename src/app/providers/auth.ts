import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthProvider {
    public currentUser;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    async signIn(user): Promise<any> {

    }

    async signOut() {

    }

    isAuthenticated(): boolean {
        return false;
    }
}