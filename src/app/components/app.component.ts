import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MapViewportService } from '@app/core/services/map/map-viewport.service';
import { HrMonitorService } from '@core/services/hr-monitor.service';
import { MapControlService } from '@core/services/map/map-control.service';
import {
  IMapService,
  MAP_SERVICE,
} from '@core/services/map/map-service.interface';
import { RideStoreFacadeService } from '@core/services/ride-store-facade.service';
import { RideTraceService } from '@core/services/ride-trace.service';
import { Subject, filter, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isActiveRide$ = this.storeFacadeService.isActiveRide$;
  activeRideTraceLocations$ = this.storeFacadeService.activeRidePoints$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.mapViewportService.shiftMapByKeyPress(event.key);
  }

  title = 'perfect-ride-map';
  private destroy$ = new Subject<void>();

  constructor(
    private storeFacadeService: RideStoreFacadeService,
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private mapControlsService: MapControlService,
    private mapViewportService: MapViewportService,
    private rideTraceService: RideTraceService,
    private hrMonitorService: HrMonitorService
  ) {}

  ngOnInit() {
    this.mapService.init();

    this.mapService.mapLoaded$.pipe(filter(Boolean), take(1)).subscribe(() => {
      this.setupFeatures();
      this.mapControlsService.addDrawToolControl();
      this.mapControlsService.addNavigationControl();
      this.mapControlsService.addTrackLocationControl();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRideButtonClick() {
    this.storeFacadeService.toggleRide();
  }

  connectSensorClick() {
    this.hrMonitorService.setup();
  }

  private setupFeatures() {
    this.setDefaultBoundingBox();
    this.bindGeolocateEventToStore();
    this.setupRideTraceLineDisplay();
  }

  private setDefaultBoundingBox() {
    var defaultBounds = [
      [33.441625353690796, 49.05362842092495], // Southwest corner [lng, lat]
      [33.23938461532995, 49.14463779177987], // Northeast corner [lng, lat]
    ];

    this.mapViewportService.setBoundingBox(defaultBounds);
  }

  private setupRideTraceLineDisplay() {
    this.rideTraceService.setupRideTraceLineDisplay(
      this.activeRideTraceLocations$.pipe(takeUntil(this.destroy$))
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
