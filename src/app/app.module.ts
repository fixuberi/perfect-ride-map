import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@core/material.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { MAPBOX_ACCESS_TOKEN, getMapboxAccessToken } from 'src/mapbox-config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import * as fromApp from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.reducers, {
      metaReducers: fromApp.metaReducers,
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: fromApp.CustomRouterStateSerializer,
    }),
    EffectsModule.forRoot([...fromApp.effects]),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          name: 'Perfect Ride Map',
          maxAge: 50,
        })
      : [],
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    { provide: MAPBOX_ACCESS_TOKEN, useValue: getMapboxAccessToken() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
