import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { environment } from './../environments/environment';

import { TruncatePipe } from './pipes/truncatepipe';

import { LayoutPage } from './layout/layout';
import { InvestmentsPage } from './pages/investments/investments';
import { SettingsPage } from './pages/settings/settings';
import { UsersPage } from './pages/settings/users/users';
import { SignInPage } from './sign-in/sign-in';
import { CompaniesPage } from './pages/companies/companies';

import { EditUserModal } from './modal/user/edit-user/edit-user';
import { NewUserModal } from './modal/user/new-user/new-user';
import { InvestmentModal } from './modal/investment/investment';

import { AuthenticationProvider } from './providers/authentication';
import { AccessGuardProvider } from './providers/access-guard';
import { UserProfileProvider } from './providers/user-profile';
import { InvestmentProvider } from './providers/investment';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { SummaryComponent } from './pages/investments/summary/summary.component';
import { TableComponent } from './pages/investments/table/table.component';
import { TilesComponent } from './pages/investments/tiles/tiles.component';

registerLocaleData(localeSv, 'sv');

@NgModule({
  declarations: [
    App,
    LayoutPage,
    SignInPage,
    InvestmentsPage,
    SettingsPage,
    UsersPage,
    CompaniesPage,
    TruncatePipe,
    EditUserModal,
    NewUserModal,
    InvestmentModal,
    SummaryComponent,
    TableComponent,
    TilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalModule.forRoot(),
    TabsModule.forRoot()
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
    InvestmentModal
  ],
  bootstrap: [App]
})
export class AppModule { }
