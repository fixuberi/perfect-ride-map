import { Injectable } from '@angular/core';
import {
  MapControl,
  MapControlService,
} from './map-control/map-control.service';
import { MapViewportService } from './map/map-viewport.service';
import { RideStoreFacadeService } from './ride-store-facade.service';
import { RideTraceService } from './ride-trace.service';

export const RIDE_CONTROLS: MapControl[] = ['navigation', 'geolocate'];

@Injectable({
  providedIn: 'root',
})
export class AppFlowService {
  private RIDE_ZOOM_LEVEL = 15.5;

  constructor(
    private rideTraceService: RideTraceService,
    private mapControlsService: MapControlService,
    private mapViewportService: MapViewportService,
    private storeFacadeService: RideStoreFacadeService
  ) {}

  setupRide() {
    this.mapControlsService.addControl(RIDE_CONTROLS);

    this.setBoundingBoxFollowingUser();
    this.bindGeolocateEventToStore();
    this.setupRideTraceLineDisplay();
  }

  teardownRide() {
    this.mapControlsService.removeAllControls();

    this.clearRideTraceLine();
  }

  private setBoundingBoxFollowingUser() {
    this.mapControlsService
      .getEventObservable('geolocate', 'geolocate')
      .subscribe((event: any) => {
        const { longitude, latitude, heading } = event.coords;

        this.mapViewportService.setCenter([latitude, longitude]);
        this.mapViewportService.easeTo(heading);

        this.mapViewportService.zoomLevel !== this.RIDE_ZOOM_LEVEL &&
          this.mapViewportService.setZoomLevel(this.RIDE_ZOOM_LEVEL);
      });
  }

  private setupRideTraceLineDisplay() {
    this.rideTraceService.setupRideTraceLineDisplay(
      this.storeFacadeService.getActiveRidePointsSource()
    );
  }

  private clearRideTraceLine() {
    this.rideTraceService.clearRideTraceLine();
  }

  private bindGeolocateEventToStore() {
    this.mapControlsService
      .getEventObservable('geolocate', 'geolocate')
      .subscribe((event: any) => {
        this.storeFacadeService.geolocateMapEvent({
          coords: event.coords,
          timestamp: event.timestamp,
        });
      });
  }
}
