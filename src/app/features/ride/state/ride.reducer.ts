import { createReducer, on } from '@ngrx/store';
import { RidePoint } from 'src/app/core/models/geo.models';
import { cacheRidePoint, startRide, stopRide } from './ride.actions';
export interface RideState {
  ridePoints: RidePoint[];
  isRide: boolean;
}

const initialState: RideState = {
  ridePoints: [],
  isRide: false,
};

export const rideFeatureKey = 'ride';

export const reducer = createReducer(
  initialState,
  on(startRide, (state) => ({ ...state, isRide: true, ridePoints: [] })),
  on(stopRide, (state) => ({ ...state, isRide: false })),
  on(cacheRidePoint, (state, { point }) => ({
    ...state,
    ridePoints: [...state.ridePoints, point],
  }))
);
