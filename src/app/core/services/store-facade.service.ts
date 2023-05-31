import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import {
  cacheRidePoint,
  selectActiveRidePoints,
  selectIsActiveRide,
  toggleRide,
} from 'src/app/features/ride/state';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  isActiveRide$ = this.store.select(selectIsActiveRide);
  activeRidePoints$ = this.store.select(selectActiveRidePoints).pipe(
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

  cacheRidePoint(point: { latitude: number; longitude: number }) {
    this.store.dispatch(cacheRidePoint({ point }));
  }
}
