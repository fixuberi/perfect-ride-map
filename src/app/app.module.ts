import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MAPBOX_ACCESS_TOKEN, getMapboxAccessToken } from 'src/mapbox-config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
      { provide: MAPBOX_ACCESS_TOKEN, useValue: getMapboxAccessToken() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
