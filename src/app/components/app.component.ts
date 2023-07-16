import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { MapService } from '../core/services/map.service';
import { RideMapService } from '../core/services/ride-map.service';
import { StoreFacadeService } from '../core/services/store-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('rideButton') mapButton!: ElementRef;

  isActiveRide$ = this.storeFacadeService.isActiveRide$;
  activeRideTraceLocations$ = this.storeFacadeService.activeRidePoints$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.mapService.shiftMapByKeyPress(event.key);
  }

  title = 'perfect-ride-map';
  private destroy$ = new Subject<void>();

  constructor(
    private storeFacadeService: StoreFacadeService,
    private mapService: MapService,
    private rideService: RideMapService
  ) {}

  ngOnInit() {
    this.mapService.init();

    this.mapService.mapLoaded$.pipe(filter(Boolean), take(1)).subscribe(() => {
      this.setupFeatures();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRideButtonClick() {
    this.storeFacadeService.toggleRide();
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

    this.mapService.setBoundingBox(defaultBounds);
  }

  private setupRideTraceLineDisplay() {
    this.rideService.setupRideTraceLineDisplay(
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
