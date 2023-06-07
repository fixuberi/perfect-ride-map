import { RideLocation } from '../models/geo.models';

export const buildGeolocateEventObject = (point: RideLocation) => {
  return {
    coords: { ...point },
    timestamp: point.timestamp,
  };
};
