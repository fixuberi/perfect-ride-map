import { Inject, Injectable } from '@angular/core';
import {
  IMapService,
  IMapViewportService,
  MAP_SERVICE,
} from './map-service.interface';

@Injectable({
  providedIn: 'root',
})
export class MapViewportService implements IMapViewportService {
  constructor(@Inject(MAP_SERVICE) private mapService: IMapService) {}

  private get map() {
    return this.mapService.map;
  }

  get zoomLevel() {
    return this.map?.getZoom();
  }

  setBoundingBox(bounds: number[][]) {
    this.map!.fitBounds(bounds as any, { padding: 20 });
  }

  setZoomLevel(zoom: number) {
    this.map!.setZoom(zoom);
  }

  setCenter(point: mapboxgl.LngLatLike) {
    this.map?.setCenter(point);
  }

  easeTo(heading: number) {
    this.map?.easeTo({ bearing: heading });
  }

  shiftMapByKeyPress(key: string) {
    const shiftAmount = 300;

    switch (key) {
      case 'w':
        this.map!.panBy([0, -shiftAmount]);
        break;
      case 'a':
        this.map!.panBy([-shiftAmount, 0]);
        break;
      case 's':
        this.map!.panBy([0, shiftAmount]);
        break;
      case 'd':
        this.map!.panBy([shiftAmount, 0]);
        break;
    }
  }
}
