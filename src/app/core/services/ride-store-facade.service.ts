import { Injectable } from '@angular/core';
import {
  geolocateMapEvent,
  selectActiveRideTrace,
  selectIsActiveRide,
  toggleRide,
} from '@features/ride/state';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideStoreFacadeService {
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

  geolocateMapEvent(event: {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number;
      accuracy: number;
      speed: number;
    };
    timestamp: number;
  }) {
    this.store.dispatch(geolocateMapEvent({ event }));
  }
}
