import { createAction, props } from '@ngrx/store';

export const startRide = createAction('[Ride] startRide');
export const stopRide = createAction('[Ride] stopRide');
export const cacheRidePoint = createAction(
  '[Ride] cacheRidePoint',
  props<{ point: any }>()
);
