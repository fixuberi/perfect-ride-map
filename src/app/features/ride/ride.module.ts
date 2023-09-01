import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@app/core/core.module';
import { MaterialModule } from '@app/core/material.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RideComponent } from './components/ride/ride.component';
import { RideRoutingModule } from './ride-routing.module';
import { RideHttpService } from './services/ride-http.service';
import { RideEffects } from './state';
import * as fromRide from './state/ride.reducer';

@NgModule({
  imports: [
    // CommonModule,
    RideRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    MaterialModule,
    StoreModule.forFeature(fromRide.rideFeatureKey, fromRide.reducer),
    EffectsModule.forFeature([RideEffects]),
  ],
  declarations: [RideComponent],
  providers: [RideHttpService],
})
export class RideModule {}
