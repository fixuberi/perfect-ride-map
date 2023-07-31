import { Inject, Injectable } from '@angular/core';
import { MapControlService } from './map/map-control.service';
import { IMapService, MAP_SERVICE } from './map/map-service.interface';
import { MapViewportService } from './map/map-viewport.service';
import { RideStoreFacadeService } from './ride-store-facade.service';
import { RideTraceService } from './ride-trace.service';

@Injectable({
  providedIn: 'root',
})
export class AppFlowService {
  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private rideTraceService: RideTraceService,
    private mapControlsService: MapControlService,
    private mapViewportService: MapViewportService,
    private storeFacadeService: RideStoreFacadeService
  ) {}

  setupRide() {
    this.setRideZoomLevel();
    this.setBoundingBoxFollowingUser();
    this.bindGeolocateEventToStore();
    this.setupRideTraceLineDisplay();

    this.mapControlsService.addNavigationControl();
    this.mapControlsService.addTrackLocationControl();
  }

  private setRideZoomLevel() {
    this.mapViewportService.setZoomLevel(15.5);
  }

  private setBoundingBoxFollowingUser() {
    this.mapService.map!.on('geolocate', (event: any) => {
      //TODO implement teardown
      const { longitude, latitude, heading } = event.coords;

      this.mapViewportService.setCenter([latitude, longitude]);
      this.mapViewportService.easeTo(heading);
    });
  }

  private setupRideTraceLineDisplay() {
    this.rideTraceService.setupRideTraceLineDisplay(
      this.storeFacadeService.getActiveRidePointsSource()
    );
  }

  private bindGeolocateEventToStore() {
    this.mapService.map!.on('geolocate', (event: any) => {
      this.storeFacadeService.geolocateMapEvent({
        coords: event.coords,
        timestamp: event.timestamp,
      });
    });
  }
}
