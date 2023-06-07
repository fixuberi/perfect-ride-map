import { createReducer, on } from '@ngrx/store';
import { RideLocation } from 'src/app/core/models/geo.models';
import { cacheRideTraceLocation, startRide, stopRide } from './ride.actions';
export interface RideState {
  rideTrace: RideLocation[];
  isRide: boolean;
}

const initialState: RideState = {
  rideTrace: [],
  isRide: false,
};

export const rideFeatureKey = 'ride';

export const reducer = createReducer(
  initialState,
  on(startRide, (state) => ({ ...state, isRide: true, rideTrace: [] })),
  on(stopRide, (state) => ({ ...state, isRide: false })),
  on(cacheRideTraceLocation, (state, { location }) => ({
    ...state,
    rideTrace: [...state.rideTrace, location],
  }))
);
