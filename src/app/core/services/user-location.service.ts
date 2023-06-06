import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  userLocation!: mapboxgl.Marker;

  constructor(private maService: MapService) {}

  setupUserLocationTracking() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.updateUserLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.log('Error occurred while getting current position: ', error);
      }
    );
  }

  updateUserLocation(latitude: number, longitude: number): void {
    if (this.userLocation) {
      this.userLocation.setLngLat([latitude, longitude]);
    } else {
      this.userLocation = new mapboxgl.Marker()
        .setLngLat([latitude, longitude])
        .addTo(this.maService.map!);
    }
  }
}
