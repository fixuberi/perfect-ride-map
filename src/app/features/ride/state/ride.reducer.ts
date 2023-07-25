import { RideLocationWwithHeartRate } from '@core/models/geo.models';
import { createReducer, on } from '@ngrx/store';
import { cacheRideTraceLocation, startRide, stopRide } from './ride.actions';
export interface RideState {
  rideHistory: RideLocationWwithHeartRate[];
  startDate: string | null;
  endDate: string | null;
  isRide: boolean;
}

const initialState: RideState = {
  rideHistory: [],
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
    rideHistory: [],
    startDate: new Date().toISOString(),
  })),
  on(stopRide, (state) => ({
    ...state,
    isRide: false,
    endDate: new Date().toISOString(),
  })),
  on(cacheRideTraceLocation, (state, { location, heartRate }) => ({
    ...state,
    rideHistory: [...state.rideHistory, { ...location, heartRate }],
  }))
);
