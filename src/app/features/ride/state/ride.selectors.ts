import { startRide } from './ride.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RideState, rideFeatureKey } from './ride.reducer';

export const selectRide = createFeatureSelector<RideState>(rideFeatureKey);

export const selectIsActiveRide = createSelector(
  selectRide,
  (state) => state.isRide
);

export const selectActiveRideTrace = createSelector(
  selectRide,
  (state) => state.rideTrace
);

export const selectCreateRideDto = createSelector(selectRide, (state) => ({
  startDate: state.startDate,
  endDate: state.endDate,
  locations: state.rideTrace,
}));
