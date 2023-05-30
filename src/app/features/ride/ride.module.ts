import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromRide from './state/ride.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RideComponent } from './components/ride/ride.component';
import { RideEffects } from './state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromRide.rideFeatureKey, fromRide.reducer),
    EffectsModule.forFeature([RideEffects]),


  ],
  declarations: [RideComponent]
})
export class RideModule { }
