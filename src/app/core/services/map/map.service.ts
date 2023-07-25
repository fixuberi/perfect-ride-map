import { Inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { MAPBOX_ACCESS_TOKEN } from 'src/mapbox-config';
import { IMapService } from './map-service.interface';

@Injectable()
export class AppMapService implements IMapService {
  map?: mapboxgl.Map;
  mapLoadedSubject = new BehaviorSubject(false);
  mapLoaded$ = this.mapLoadedSubject.asObservable();

  constructor(@Inject(MAPBOX_ACCESS_TOKEN) public mapboxAccessToken: string) {}

  init() {
    this.initMap();
    this.bindMapLoadEvent();
  }

  private bindMapLoadEvent() {
    this.map!.on('load', () => {
      this.mapLoadedSubject.next(true);
    });
  }

  private initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 2,
    });
  }

  setBoundingBox(bounds: number[][]) {
    this.map!.fitBounds(bounds as any, { padding: 20 });
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
}
