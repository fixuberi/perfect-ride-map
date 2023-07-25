import { Inject, Injectable } from '@angular/core';
import { RidePoint } from '@core/models/geo.models';
import { ridePointToLngLatLike } from '@core/utils/geo.utils';
import {
  IMapLayerService,
  IMapService,
  MAP_SERVICE,
} from './map-service.interface';

@Injectable({
  providedIn: 'root',
})
export class MapLayerService implements IMapLayerService {
  constructor(@Inject(MAP_SERVICE) private mapService: IMapService) {}

  private get map() {
    return this.mapService.map;
  }

  isLayerExists(layerId: string) {
    const mapLayers = this.map?.getStyle().layers || [];
    return mapLayers.some((layer) => layer.id === layerId);
  }

  isSourceExists(layerId: string) {
    const sources = this.map?.getStyle().sources || [];
    return Object.keys(sources).some((key) => key === layerId);
  }

  removeLayerWithSource(layerId: string): void {
    if (this.map!.getLayer(layerId)) {
      this.map!.removeLayer(layerId);
    }
    if (this.map!.getSource(layerId)) {
      this.map!.removeSource(layerId);
    }
  }

  udpateDataSourceCoordinates(points: RidePoint[], sourceId: string) {
    const source = this.map!.getSource(sourceId) as mapboxgl.GeoJSONSource;

    if (source) {
      const geojson = (source as any)._data;
      geojson.geometry.coordinates = points.map(ridePointToLngLatLike);
      source.setData(geojson);
    }
  }

  addSpline(points: RidePoint[], sourceId: string, layerId: string): void {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points.map(ridePointToLngLatLike),
      },
    };
    this.map!.addSource(sourceId, {
      type: 'geojson',
      data: feature as any,
    });
    this.map!.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#0000ff',
        'line-width': 3,
        'line-opacity': 0.7,
      },
    });
  }
}
