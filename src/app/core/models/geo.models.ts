export interface RidePoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface RideLocation extends RidePoint {
  timestamp: string;
  speed: number;
}
