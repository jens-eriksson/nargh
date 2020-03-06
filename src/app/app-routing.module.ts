import { CompaniesPage } from './pages/companies/companies';
import { SettingsPage } from './pages/settings/settings';
import { AccessGuardProvider } from './providers/access-guard.provider';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from './layout/layout';
import { SignInPage } from './sign-in/sign-in';
import { InvestmentsPage } from './pages/investments/investments';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    canActivate: [AccessGuardProvider],
    children: [
      {
        path: '',
        redirectTo: 'investments',
        pathMatch: 'full'
      },
      {
        path: 'investments',
        component: InvestmentsPage,
        canActivate: [AccessGuardProvider]
      },
      {
        path: 'companies',
        component: CompaniesPage,
        canActivate: [AccessGuardProvider]
      },
      {
        path: 'settings',
        component: SettingsPage,
        canActivate: [AccessGuardProvider]
      }
    ]
  },
  { path: 'sign-in', component: SignInPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
