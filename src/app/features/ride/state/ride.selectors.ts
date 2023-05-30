import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RideState, rideFeatureKey } from './ride.reducer';

export const selectRide = createFeatureSelector<RideState>(rideFeatureKey);

export const selectActiverRidePoints = createSelector(
  selectRide,
  (state) => state.ridePoints
);
