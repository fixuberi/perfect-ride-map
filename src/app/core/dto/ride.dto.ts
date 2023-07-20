import { RideLocationWwithHeartRate } from '../models/geo.models';

export interface CreateRideDto {
  startDate: string | null;
  endDate: string | null;
  rideHistory: RideLocationWwithHeartRate[];
}
