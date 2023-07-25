import { InjectionToken } from '@angular/core';
import { RidePoint } from '@core/models/geo.models';
import { Observable } from 'rxjs';

export interface IMapService {
  map?: mapboxgl.Map;
  mapLoaded$: Observable<boolean>;
  mapboxAccessToken: string;

  init: () => void;
}

export const MAP_SERVICE = new InjectionToken<IMapService>('MapService');

export interface IMapLayerService {
  isLayerExists: (layerId: string) => boolean;
  isSourceExists: (sourceId: string) => boolean;
  udpateDataSourceCoordinates: (points: RidePoint[], sourceId: string) => void;
  addSpline: (points: RidePoint[], sourceId: string, layerId: string) => void;
}

export interface IMapViewportService {
  shiftMapByKeyPress: (key: string) => void;
  setBoundingBox: (bounds: number[][]) => void;
  setZoomLevel: (zoom: number) => void;
}
