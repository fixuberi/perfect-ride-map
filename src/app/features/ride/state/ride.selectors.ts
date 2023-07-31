import { CreateRideDto } from '@core/dto/ride.dto';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RideState, rideFeatureKey } from './ride.reducer';

export const selectRide = createFeatureSelector<RideState>(rideFeatureKey);

export const selectIsActiveRide = createSelector(
  selectRide,
  (state) => state.isRide
);

export const selectRideHistory = createSelector(
  selectRide,
  (state) => state.rideHistory
);

export const selectCreateRideDto = createSelector(
  selectRide,
  (state): CreateRideDto => ({
    startDate: state.startDate,
    endDate: state.endDate,
    rideHistory: state.rideHistory,
  })
);
