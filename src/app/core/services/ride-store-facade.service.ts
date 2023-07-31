import { Injectable } from '@angular/core';
import {
  geolocateMapEvent,
  selectIsActiveRide,
  selectRideHistory,
  toggleRide,
} from '@features/ride/state';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RideStoreFacadeService {
  isActiveRide$ = this.store.select(selectIsActiveRide);
  cachedRidePoints$ = this.store.select(selectRideHistory);

  constructor(private store: Store) {}

  getActiveRidePointsSource() {
    return this.cachedRidePoints$.pipe(
      takeUntil(this.isActiveRide$.pipe(filter((isActive) => !isActive)))
    );
  }

  toggleRide() {
    this.store.dispatch(toggleRide());
  }

  geolocateMapEvent(event: {
    //TODO extract to type alias, use also in action def
    coords: {
      latitude: number;
      longitude: number;
      altitude: number;
      accuracy: number;
      speed: number;
      heading: number;
    };
    timestamp: number;
  }) {
    this.store.dispatch(geolocateMapEvent({ event }));
  }
}
