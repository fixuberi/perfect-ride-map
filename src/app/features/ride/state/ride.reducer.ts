import { createReducer, on } from '@ngrx/store';
import { loadFeature, featureLoaded } from './ride.actions';

export interface RideState {
  ridePoints: any[]; //location with time,
  isRide: boolean;
}
//when user stop ride - ride points used o construct object of class Ride and save to persistant store

const initialState: RideState = {
  ridePoints: [],
  isRide: false,
};

export const rideFeatureKey = 'ride';

export const reducer = createReducer(
  initialState,
  on(loadFeature, (state) => state),
  on(featureLoaded, (state, { data }) => ({ ...state, data }))
);
