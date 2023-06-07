import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RideLocation } from '../models/geo.models';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  constructor(private mapService: MapService) {}

  setupRideTraceLineDisplay(activeRidePoints$: Observable<RideLocation[]>) {
    const RIDE_TRACE_LAYER_ID = 'RIDE_TRACE_LAYER_ID';
    const RIDE_TRACE_SOURCE_ID = 'RIDE_TRACE_SOURCE_ID';

    activeRidePoints$.subscribe((points) => {
      if (
        this.mapService.isLayerExists(RIDE_TRACE_LAYER_ID) &&
        this.mapService.isSourceExists(RIDE_TRACE_SOURCE_ID)
      ) {
        this.mapService.udpateDataSourceCoordinates(
          points,
          RIDE_TRACE_SOURCE_ID
        );
      } else {
        this.mapService.addSpline(
          points,
          RIDE_TRACE_SOURCE_ID,
          RIDE_TRACE_LAYER_ID
        );
      }
    });
  }
}
