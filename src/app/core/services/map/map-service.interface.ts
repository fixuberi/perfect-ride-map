import { InjectionToken } from '@angular/core';
import { RidePoint } from '@core/models/geo.models';
import { Observable } from 'rxjs';

export interface IMapService {
  map?: mapboxgl.Map;
  mapLoaded$: Observable<boolean>;
  mapboxAccessToken: string;

  init: () => void;

  //TODO move to dedicated services
  shiftMapByKeyPress: (key: string) => void;
  setBoundingBox: (bounds: number[][]) => void;
}

export const MAP_SERVICE = new InjectionToken<IMapService>('MapService');

export interface IMapLayerService {
  isLayerExists: (layerId: string) => boolean;
  isSourceExists: (sourceId: string) => boolean;
  udpateDataSourceCoordinates: (points: RidePoint[], sourceId: string) => void;
  addSpline: (points: RidePoint[], sourceId: string, layerId: string) => void;
}
