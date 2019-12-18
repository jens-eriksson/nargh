import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LinksPage } from './pages/links/links';

const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'links', component: LinksPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
