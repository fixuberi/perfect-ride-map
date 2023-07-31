import { RideLocation } from '@core/models/geo.models';
import { createAction, props } from '@ngrx/store';

export const startRide = createAction('[Ride] startRide');
export const stopRide = createAction('[Ride] stopRide');
export const toggleRide = createAction('[Ride] toggleRide');
export const cacheRideTraceLocation = createAction(
  '[Ride] cacheRideTraceLocation',
  props<{ location: RideLocation; heartRate: number | null }>()
);

export const geolocateMapEvent = createAction(
  '[Ride] geolocateMapEvent',
  props<{
    event: {
      coords: {
        latitude: number;
        longitude: number;
        altitude: number;
        accuracy: number;
        speed: number;
        heading: number;
      };
      timestamp: number;
    };
  }>()
);

export const createRideSuccess = createAction('[Ride] create ride SUCCESS');
