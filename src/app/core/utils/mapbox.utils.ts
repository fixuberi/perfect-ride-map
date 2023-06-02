export const buildGeolocateEventObject = (point: number[]) => {
  return {
    coords: {
      latitude: point[0],
      longitude: point[1],
    },
  };
};
