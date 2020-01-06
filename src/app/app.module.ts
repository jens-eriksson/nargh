import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { environment } from './../environments/environment';

import { TruncatePipe } from './pipes/truncatepipe';

import { LayoutPage } from './layout/layout';
import { InvestmentsPage } from './pages/investments/investments';
import { UsersPage } from './pages/users/users';
import { SignInPage } from './sign-in/sign-in';

import { EditUserModal } from './modal/edit-user/edit-user';
import { NewUserModal } from './modal/new-user/new-user';
import { NewInvestmentModal } from './modal/new-investment/new-investment';

import { AuthenticationProvider } from './providers/authentication';
import { AccessGuardProvider } from './providers/access-guard';
import { UserProfileProvider } from './providers/user-profile';
import { InvestmentProvider } from './providers/investment';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';

registerLocaleData(localeSv, 'sv');

@NgModule({
  declarations: [
    App,
    LayoutPage,
    SignInPage,
    InvestmentsPage,
    UsersPage,
    TruncatePipe,
    EditUserModal,
    NewUserModal,
    NewInvestmentModal
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalModule.forRoot()
  ],
  providers: [
    AuthenticationProvider,
    AccessGuardProvider,
    UserProfileProvider,
    InvestmentProvider
  ],
  entryComponents: [
    EditUserModal,
    NewUserModal,
    NewInvestmentModal
  ],
  bootstrap: [App]
})
export class AppModule { }
