import { Inject, Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { IMapService, MAP_SERVICE } from './map-service.interface';

@Injectable({
  providedIn: 'root',
})
export class MapControlService {
  private drawControl: MapboxDraw = new MapboxDraw();
  private trackLocationControl: mapboxgl.GeolocateControl =
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserLocation: false,
    });
  private navigationControl = new mapboxgl.NavigationControl();

  constructor(@Inject(MAP_SERVICE) private mapService: IMapService) {}

  private get map() {
    return this.mapService.map;
  }

  addTrackLocationControl(): void {
    this.map?.addControl(this.trackLocationControl);
  }

  addDrawToolControl() {
    this.map?.addControl(this.drawControl);
  }

  addNavigationControl() {
    this.map?.addControl(this.navigationControl);
  }
}
