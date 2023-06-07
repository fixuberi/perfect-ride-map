import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import {
  cacheRideTraceLocation,
  geolocateMapEvent,
  selectActiveRideTrace,
  selectIsActiveRide,
  toggleRide,
} from 'src/app/features/ride/state';
import { RideLocation } from '../models/geo.models';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  isActiveRide$ = this.store.select(selectIsActiveRide);
  activeRidePoints$ = this.store.select(selectActiveRideTrace).pipe(
    withLatestFrom(this.store.select(selectIsActiveRide)),
    map(([points, isActiveRide]) => {
      if (!isActiveRide) {
        return [];
      } else return points;
    })
  );

  constructor(private store: Store) {}

  toggleRide() {
    this.store.dispatch(toggleRide());
  }

  cacheRidePoint(location: RideLocation) {
    this.store.dispatch(cacheRideTraceLocation({ location }));
  }

  geolocateMapEvent(event: {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number;
      accuracy: number;
    };
    timestamp: number;
  }) {
    this.store.dispatch(geolocateMapEvent({ event }));
  }
}
