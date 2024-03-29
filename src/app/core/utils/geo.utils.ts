import { LngLatLike } from 'mapbox-gl';
import { RidePoint } from '../models/geo.models';

export const ridePointToLngLatLike = (point: RidePoint): LngLatLike => [
  point.latitude,
  point.longitude,
];
