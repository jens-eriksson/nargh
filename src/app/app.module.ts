import { ForecastProvider } from './providers/forecast.provider';
import { UtilProvider } from './providers/util.provider';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
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
import { InvestmentPage } from './pages/investment/investment';

import { AuthenticationProvider } from './providers/authentication.provider';
import { AccessGuardProvider } from './providers/access-guard.provider';
import { UserProfileProvider } from './providers/user-profile.provider';
import { InvestmentProvider } from './providers/investment.provider';
import { ChartProvider } from './providers/chart.provider';
import { ModalPageProvider } from './providers/modal-page.provider';
import { SalaryProvider } from './providers/salary.provider';
import { LayoutProvider } from './providers/layout.provider';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';

import { SummaryComponent } from './pages/investments/summary/summary.component';
import { TableComponent } from './pages/investments/table/table.component';
import { TilesComponent } from './pages/investments/tiles/tiles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineChartComponent } from './pages/investments/timeline-chart/timeline-chart.component';
import { BondChartComponent } from './pages/investments/bond-chart/bond-chart.component';
import { ForecastComponent } from './pages/investments/forecast/forecast.component';
import { ModalPageComponent } from './layout/modal-page/modal-page.component';

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
    InvestmentPage,
    SummaryComponent,
    TableComponent,
    TilesComponent,
    TimelineChartComponent,
    BondChartComponent,
    ModalPageComponent,
    ForecastComponent
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
    TabsModule.forRoot(),
    BrowserAnimationsModule,
    EditorModule
  ],
  providers: [
    AuthenticationProvider,
    AccessGuardProvider,
    UserProfileProvider,
    SalaryProvider,
    InvestmentProvider,
    ChartProvider,
    ModalPageProvider,
    LayoutProvider,
    UtilProvider,
    ForecastProvider
  ],
  entryComponents: [
    EditUserModal,
    NewUserModal,
    ModalPageComponent,
    InvestmentPage
  ],
  bootstrap: [App]
})
export class AppModule { }
