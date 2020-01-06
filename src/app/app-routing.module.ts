import { UsersPage } from './pages/users/users';
import { AccessGuardProvider } from './providers/access-guard';
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
        path: 'investments',
        component: InvestmentsPage,
        canActivate: [AccessGuardProvider]
      },
      {
        path: 'users',
        component: UsersPage,
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
