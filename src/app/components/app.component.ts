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
import { RideService } from '../core/services/ride.service';
import { StoreFacadeService } from '../core/services/store-facade.service';
import { UserLocationService } from '../core/services/user-location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('rideButton') mapButton!: ElementRef;

  isActiveRide$ = this.storeFacadeService.isActiveRide$;
  activeRidePoints$ = this.storeFacadeService.activeRidePoints$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.mapService.shiftMapByKeyPress(event.key);
  }

  title = 'perfect-ride-map';
  private destroy$ = new Subject<void>();

  constructor(
    private storeFacadeService: StoreFacadeService,
    private mapService: MapService,
    private userLocationService: UserLocationService,
    private rideService: RideService
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

  saveUserLocationChanges(latitude: number, longitude: number) {
    this.storeFacadeService.cacheRidePoint({ latitude, longitude });
  }

  private setupFeatures() {
    this.setDefaultBoundingBox();
    this.userLocationService.setupUserLocationTracking();
    this.setupCachingUserMovement();
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
      this.activeRidePoints$.pipe(takeUntil(this.destroy$))
    );
  }

  private setupCachingUserMovement() {
    this.mapService.map!.on('geolocate', (event) => {
      const { coords } = event;
      const { latitude, longitude } = coords;

      this.userLocationService.updateUserLocation(latitude, longitude);
      this.saveUserLocationChanges(latitude, longitude);
    });
  }
}
