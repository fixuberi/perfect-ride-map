import { createAction, props } from '@ngrx/store';
import { RideLocation } from 'src/app/core/models/geo.models';

export const startRide = createAction('[Ride] startRide');
export const stopRide = createAction('[Ride] stopRide');
export const toggleRide = createAction('[Ride] toggleRide');
export const cacheRideTraceLocation = createAction(
  '[Ride] cacheRideTraceLocation',
  props<{ location: RideLocation }>()
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
      };
      timestamp: number;
    };
  }>()
);
