import { LayoutPage } from './layout/layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { TruncatePipe } from './pipes/truncatepipe';
import { HomePage } from './pages/home/home';
import { LinksPage } from './pages/links/links';

@NgModule({
  declarations: [
    App,
    LayoutPage,
    HomePage,
    LinksPage,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
