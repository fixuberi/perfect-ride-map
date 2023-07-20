import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RideState, rideFeatureKey } from './ride.reducer';
import { CreateRideDto } from '@core/dto/ride.dto';

export const selectRide = createFeatureSelector<RideState>(rideFeatureKey);

export const selectIsActiveRide = createSelector(
  selectRide,
  (state) => state.isRide
);

export const selectActiveRideTrace = createSelector(
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
