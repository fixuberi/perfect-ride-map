import { Component, Inject, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MAPBOX_ACCESS_TOKEN } from 'src/mapbox-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'perfect-ride-map';
  map!: mapboxgl.Map;

constructor(@Inject(MAPBOX_ACCESS_TOKEN) public mapboxAccessToken: string) {
}

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken:
      environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });
    this.map.addControl(new mapboxgl.NavigationControl());


    // const southWest = new mapboxgl.LngLat(this.lng, this.lat);
    // const northEast = new mapboxgl.LngLat(this.lng +2, this.lat+2);
    // const boundingBox = new mapboxgl.LngLatBounds(southWest, northEast);
  }

  public addSpline(spline: any): void {
    const feature = {
      type: 'Feature',
      geometry: spline.geometry
    };
    this.map.addSource('spline', {
      type: 'geojson',
      data: feature as any
    });
    this.map.addLayer({
      id: 'spline',
      type: 'line',
      source: 'spline',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#0000ff',
        'line-width': 3,
        'line-opacity': 0.7
      }
    });
  }

  public addPolygon(coordinates: number[][][]): void {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      }
    };
    this.map.addSource('polygon', {
      type: 'geojson',
      data: feature as any
    });
    this.map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'polygon',
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
        'fill-outline-color': '#0000ff'
      }
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
    const marker = new mapboxgl.Marker().setLngLat(lngLat).setPopup(popup).addTo(this.map);
  }

  public createSpline(coordinates: number[][]): any {
    const points = turf.lineString(coordinates);
    const spline = turf.bezierSpline(points);
    return spline;
  }
}
