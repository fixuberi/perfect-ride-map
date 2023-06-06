import { Inject, Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MAPBOX_ACCESS_TOKEN } from 'src/mapbox-config';
import { RidePoint } from '../models/geo.models';
import { ridePointToLngLatLike } from '../utils/geo.utils';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: mapboxgl.Map;
  draw!: MapboxDraw;
  trackLocationControl?: mapboxgl.GeolocateControl;

  mapLoadedSubject = new BehaviorSubject(false);
  mapLoaded$ = this.mapLoadedSubject.asObservable();

  constructor(@Inject(MAPBOX_ACCESS_TOKEN) public mapboxAccessToken: string) {}

  init() {
    this.initMap();
    this.bindMapLoadEvent();
    this.addTrackLocationControl();
    this.addDrawTool();
  }

  bindMapLoadEvent() {
    this.map!.on('load', () => {
      this.mapLoadedSubject.next(true);
    });
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 2,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  isLayerExists(layerId: string) {
    const mapLayers = this.map?.getStyle().layers || [];
    return mapLayers.some((layer) => layer.id === layerId);
  }

  isSourceExists(layerId: string) {
    const sources = this.map?.getStyle().sources || [];
    return Object.keys(sources).some((key) => key === layerId);
  }

  setBoundingBox(bounds: number[][]) {
    this.map!.fitBounds(bounds as any, { padding: 20 });
  }

  addTrackLocationControl(): void {
    const trackLocationControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserLocation: false,
    });

    this.map!.addControl(trackLocationControl);
  }

  private addDrawTool() {
    this.draw = new MapboxDraw();
    this.map!.addControl(this.draw);
  }

  public removeLayerWithSource(layerId: string): void {
    if (this.map!.getLayer(layerId)) {
      this.map!.removeLayer(layerId);
    }
    if (this.map!.getSource(layerId)) {
      this.map!.removeSource(layerId);
    }
  }

  udpateDataSourceCoordinates(points: RidePoint[], sourceId: string) {
    const source = this.map!.getSource(sourceId) as mapboxgl.GeoJSONSource;

    if (source) {
      const geojson = (source as any)._data;
      geojson.geometry.coordinates = points.map(ridePointToLngLatLike);
      source.setData(geojson);
    }
  }

  shiftMapByKeyPress(key: string) {
    const shiftAmount = 300;

    switch (key) {
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
}
