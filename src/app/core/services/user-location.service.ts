import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  userLocation!: mapboxgl.Marker;

  constructor(private maService: MapService) {}

  updateUserLocation(latitude: number, longitude: number): void {
    if (this.userLocation) {
      this.userLocation.setLngLat([latitude, longitude]);
    } else {
      if (this.maService.map) {
        this.userLocation = new mapboxgl.Marker()
          .setLngLat([latitude, longitude])
          .addTo(this.maService.map!);
      }
    }
  }
}
