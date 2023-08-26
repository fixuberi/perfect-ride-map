import { Injectable } from '@angular/core';
import { RideLocation } from '@core/models/geo.models';
import { Observable } from 'rxjs';
import { MapLayerService } from './map/map-layer.service';

@Injectable({
  providedIn: 'root',
})
export class RideTraceService {
  RIDE_TRACE_LAYER_ID = 'RIDE_TRACE_LAYER_ID';
  RIDE_TRACE_SOURCE_ID = 'RIDE_TRACE_SOURCE_ID';

  constructor(private mapLayerService: MapLayerService) {}

  setupRideTraceLineDisplay(activeRidePoints$: Observable<RideLocation[]>) {
    activeRidePoints$.subscribe((points) => {
      if (
        this.mapLayerService.isLayerExists(this.RIDE_TRACE_LAYER_ID) &&
        this.mapLayerService.isSourceExists(this.RIDE_TRACE_SOURCE_ID)
      ) {
        this.mapLayerService.udpateDataSourceCoordinates(
          points,
          this.RIDE_TRACE_SOURCE_ID
        );
      } else {
        this.mapLayerService.addSpline(
          points,
          this.RIDE_TRACE_SOURCE_ID,
          this.RIDE_TRACE_LAYER_ID
        );
      }
    });
  }

  clearRideTraceLine() {
    this.mapLayerService.removeLayerWithSource(
      this.RIDE_TRACE_LAYER_ID,
      this.RIDE_TRACE_SOURCE_ID
    );
  }
}
