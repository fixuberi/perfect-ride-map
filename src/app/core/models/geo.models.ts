export type RidePoint = {
  latitude: number;
  longitude: number;
  altitude?: number;
};

export type Location = RidePoint & {
  accuracy: number;
  timestamp: number;
};
