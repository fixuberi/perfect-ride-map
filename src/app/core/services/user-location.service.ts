import { Inject, Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { IMapService, MAP_SERVICE } from './map/map-service.interface';

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  userLocation!: mapboxgl.Marker;

  constructor(@Inject(MAP_SERVICE) private mapService: IMapService) {}

  updateUserLocation(latitude: number, longitude: number): void {
    if (this.userLocation) {
      this.userLocation.setLngLat([latitude, longitude]);
    } else {
      if (this.mapService.map) {
        this.userLocation = new mapboxgl.Marker()
          .setLngLat([latitude, longitude])
          .addTo(this.mapService.map!);
      }
    }
  }
}
