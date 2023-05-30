import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import * as mapboxgl from 'mapbox-gl';
import { interval, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MAPBOX_ACCESS_TOKEN } from 'src/mapbox-config';
import { StoreFacadeService } from '../core/services/store-facade.service';
import { mockPoints } from './mock-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('rideButton') mapButton!: ElementRef;

  draw!: MapboxDraw;
  isActiveRide$ = this.storeFacadeService.isActiveRide$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const shiftAmount = 300; // Adjust the shift amount as needed

    switch (event.key) {
      case 'w':
        this.map.panBy([0, -shiftAmount]);
        break;
      case 'a':
        break;
      case 's':
        this.map.panBy([0, shiftAmount]);
        break;
      case 'd':
        this.map.panBy([shiftAmount, 0]);
        break;
    }
  }

  title = 'perfect-ride-map';
  map!: mapboxgl.Map;
  userLocation!: mapboxgl.Marker;

  constructor(
    @Inject(MAPBOX_ACCESS_TOKEN) public mapboxAccessToken: string,
    private storeFacadeService: StoreFacadeService
  ) {}

  ngOnInit() {
    this.initMap();
    this.setupUserLocationTracking();
    this.addTrackLocationControl();

    this.setupMovingUserMarker();

    this.draw = new MapboxDraw();
    this.map.addControl(this.draw);
    // const southWest = new mapboxgl.LngLat(this.lng, this.lat);
    // const northEast = new mapboxgl.LngLat(this.lng +2, this.lat+2);
    // const boundingBox = new mapboxgl.LngLatBounds(southWest, northEast);

    this.simulateUserMovement();
  }

  private simulateUserMovement() {
    interval(1000)
      .pipe(
        take(30),
        tap((index) => console.log(index))
      )
      .subscribe((index) => {
        this.map.fire('geolocate', mockPoints[index]);
      });
  }

  private setupMovingUserMarker() {
    this.map.on('geolocate', (event) => {
      const { coords } = event;
      const { latitude, longitude } = coords;

      // Update the marker's position
      this.userLocation.setLngLat([longitude, latitude]);

      // Save the user's location changes in your desired storage or backend
      // For example, you can make an API call to save the location changes
      this.saveUserLocationChanges(latitude, longitude);
    });
  }

  private setupUserLocationTracking() {
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
      this.userLocation.setLngLat([longitude, latitude]);
    } else {
      this.userLocation = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(this.map);
    }
  }

  addTrackLocationControl(): void {
    const trackLocationControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: false,
    });

    this.map.addControl(trackLocationControl);
    trackLocationControl.on('geolocate', (event: any) => {
      this.updateUserLocation(event?.coords.latitude, event?.coords.longitude);
    });
  }

  onRideButtonClick() {
    this.storeFacadeService.toggleRide();
  }

  private initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  public addSpline(spline?: any): void {
    const feature = {
      type: 'Feature',
      geometry: spline.geometry,
    };
    this.map.addSource('spline', {
      type: 'geojson',
      data: feature as any,
    });
    this.map.addLayer({
      id: 'spline',
      type: 'line',
      source: 'spline',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#0000ff',
        'line-width': 3,
        'line-opacity': 0.7,
      },
    });
  }

  public addPolygon(coordinates: number[][][]): void {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
      },
    };
    this.map.addSource('polygon', {
      type: 'geojson',
      data: feature as any,
    });
    this.map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'polygon',
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
        'fill-outline-color': '#0000ff',
      },
    });
  }

  public removeLayer(layerId: string): void {
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
    if (this.map.getSource(layerId)) {
      this.map.removeSource(layerId);
    }
  }

  public addMarker(lngLat: mapboxgl.LngLatLike, popupText?: string): void {
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(popupText!);
    const marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(this.map);
  }

  public createSpline(coordinates: number[][]): any {
    const points = turf.lineString(coordinates);
    const spline = turf.bezierSpline(points);
    return spline;
  }

  passedRoutePoints: any[] = [];
  saveUserLocationChanges(latitude: number, longitude: number) {
    this.passedRoutePoints.push([latitude, longitude]);
  }
}

// add active ride overlay on map (time, distancec etc + stop\pause button)
// add rides history list
