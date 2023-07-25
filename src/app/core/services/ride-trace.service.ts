import { Injectable } from '@angular/core';
import { RideLocation } from '@core/models/geo.models';
import { Observable } from 'rxjs';
import { MapLayerService } from './map/map-layer.service';

@Injectable({
  providedIn: 'root',
})
export class RideTraceService {
  constructor(private mapLayerService: MapLayerService) {}

  setupRideTraceLineDisplay(activeRidePoints$: Observable<RideLocation[]>) {
    const RIDE_TRACE_LAYER_ID = 'RIDE_TRACE_LAYER_ID';
    const RIDE_TRACE_SOURCE_ID = 'RIDE_TRACE_SOURCE_ID';

    activeRidePoints$.subscribe((points) => {
      if (
        this.mapLayerService.isLayerExists(RIDE_TRACE_LAYER_ID) &&
        this.mapLayerService.isSourceExists(RIDE_TRACE_SOURCE_ID)
      ) {
        this.mapLayerService.udpateDataSourceCoordinates(
          points,
          RIDE_TRACE_SOURCE_ID
        );
      } else {
        this.mapLayerService.addSpline(
          points,
          RIDE_TRACE_SOURCE_ID,
          RIDE_TRACE_LAYER_ID
        );
      }
    });
  }
}
