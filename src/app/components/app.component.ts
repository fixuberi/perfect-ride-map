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
import { GeoJSONSource } from 'mapbox-gl';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MAPBOX_ACCESS_TOKEN } from 'src/mapbox-config';
import { RidePoint } from '../core/models/geo.models';
import { StoreFacadeService } from '../core/services/store-facade.service';
import { ridePointToLngLatLike } from '../core/utils/geo.utils';
import { buildGeolocateEventObject } from '../core/utils/mapbox.utils';
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
  activeRidePoints$ = this.storeFacadeService.activeRidePoints$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const shiftAmount = 300;

    switch (event.key) {
      case 'w':
        this.map!.panBy([0, -shiftAmount]);
        break;
      case 'a':
        this.map!.panBy([-shiftAmount, 0]);
        break;
      case 's':
        this.map!.panBy([0, shiftAmount]);
        break;
      case 'd':
        this.map!.panBy([shiftAmount, 0]);
        break;
    }
  }

  title = 'perfect-ride-map';
  map?: mapboxgl.Map;
  userLocation!: mapboxgl.Marker;

  constructor(
    @Inject(MAPBOX_ACCESS_TOKEN) public mapboxAccessToken: string,
    private storeFacadeService: StoreFacadeService
  ) {}

  ngOnInit() {
    this.initMap();
    this.setDefaultBoundingBox();
    this.setupUserLocationTracking();
    this.addTrackLocationControl();

    this.setupCachingUserMovement();

    this.addDrawTool();

    this.setupRideTraceLineDisplay();
    this.simulateUserMovement();
  }

  private addDrawTool() {
    this.draw = new MapboxDraw();
    this.map!.addControl(this.draw);
  }

  private setDefaultBoundingBox() {
    var bounds = [
      [33.441625353690796, 49.05362842092495], // Southwest corner [lng, lat]
      [33.23938461532995, 49.14463779177987], // Northeast corner [lng, lat]
    ];

    // Set the map's viewport to fit the bounding box
    this.map!.fitBounds(bounds as any, { padding: 20 });
  }

  private setupRideTraceLineDisplay() {
    const RIDE_TRACE_LAYER_ID = 'RIDE_TRACE_LAYER_ID';
    const RIDE_TRACE_SOURCE_ID = 'RIDE_TRACE_SOURCE_ID';

    this.activeRidePoints$.subscribe((points) => {
      if (
        this.isLayerExists(RIDE_TRACE_LAYER_ID) &&
        this.isSourceExists(RIDE_TRACE_SOURCE_ID)
      ) {
        console.log('udpateDataSource');
        this.udpateDataSource(points, RIDE_TRACE_SOURCE_ID);
      } else {
        console.log('addSpline');
        this.addSpline(points, RIDE_TRACE_SOURCE_ID, RIDE_TRACE_LAYER_ID);
      }
    });
  }

  isLayerExists(layerId: string) {
    const mapLayers = this.map?.getStyle().layers || [];
    return mapLayers.some((layer) => layer.id === layerId);
  }

  isSourceExists(layerId: string) {
    const sources = this.map?.getStyle().sources || [];
    return Object.keys(sources).some((key) => key === layerId);
  }

  udpateDataSource(points: RidePoint[], sourceId: string) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points.map(ridePointToLngLatLike),
      },
      properties: {},
    };

    const source = this.map!.getSource(sourceId) as GeoJSONSource;
    source.setData(geojson as any);
  }

  private simulateUserMovement() {
    interval(300).subscribe((index) => {
      this.map!.fire(
        'geolocate',
        buildGeolocateEventObject(mockPoints[index] as number[])
      );
    });
  }

  private setupCachingUserMovement() {
    this.map!.on('geolocate', (event) => {
      const { coords } = event;
      const { latitude, longitude } = coords;
      // Update the marker's position
      this.userLocation.setLngLat([latitude, longitude]);

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
      this.userLocation.setLngLat([latitude, longitude]);
    } else {
      this.userLocation = new mapboxgl.Marker()
        .setLngLat([latitude, longitude])
        .addTo(this.map!);
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

    this.map!.addControl(trackLocationControl);
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

  public addSpline(
    points: RidePoint[],
    sourceId: string,
    layerId: string
  ): void {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points.map(ridePointToLngLatLike),
      },
    };
    this.map!.addSource(sourceId, {
      type: 'geojson',
      data: feature as any,
    });
    this.map!.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
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
    this.map!.addSource('polygon', {
      type: 'geojson',
      data: feature as any,
    });
    this.map!.addLayer({
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
    if (this.map!.getLayer(layerId)) {
      this.map!.removeLayer(layerId);
    }
    if (this.map!.getSource(layerId)) {
      this.map!.removeSource(layerId);
    }
  }

  public addMarker(lngLat: mapboxgl.LngLatLike, popupText?: string): void {
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(popupText!);
    const marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(this.map!);
  }

  public createSpline(coordinates: number[][]): any {
    const points = turf.lineString(coordinates);
    const spline = turf.bezierSpline(points);
    return spline;
  }

  saveUserLocationChanges(latitude: number, longitude: number) {
    this.storeFacadeService.cacheRidePoint({ latitude, longitude });
  }
}
