import { createReducer, on } from '@ngrx/store';
import { RideLocation } from 'src/app/core/models/geo.models';
import { cacheRideTraceLocation, startRide, stopRide } from './ride.actions';
export interface RideState {
  rideTrace: RideLocation[];
  startDate: string | null;
  endDate: string | null;
  isRide: boolean;
}

const initialState: RideState = {
  rideTrace: [],
  startDate: null,
  endDate: null,
  isRide: false,
};

export const rideFeatureKey = 'ride';

export const reducer = createReducer(
  initialState,
  on(startRide, (state) => ({
    ...state,
    isRide: true,
    rideTrace: [],
    startDate: new Date().toISOString(),
  })),
  on(stopRide, (state) => ({
    ...state,
    isRide: false,
    endDate: new Date().toISOString(),
  })),
  on(cacheRideTraceLocation, (state, { location }) => ({
    ...state,
    rideTrace: [...state.rideTrace, location],
  }))
);
