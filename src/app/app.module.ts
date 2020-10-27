import { SignageService } from './services/signage.service';
import { SignalRService } from './services/signal-r.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignageComponent } from './signage/signage.component';

@NgModule({
  declarations: [
    AppComponent,
    SignageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [SignalRService, SignageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
