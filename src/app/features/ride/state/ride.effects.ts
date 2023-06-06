import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { interval } from 'rxjs';
import { mockPoints } from 'src/app/components/mock-data';
import { MapService } from 'src/app/core/services/map.service';
import { buildGeolocateEventObject } from 'src/app/core/utils/mapbox.utils';
import * as actions from './ride.actions';
import { selectIsActiveRide } from './ride.selectors';

@Injectable()
export class RideEffects {
  loadFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.toggleRide),
      withLatestFrom(this.store.select(selectIsActiveRide)),
      map(([, isRide]) => {
        return !isRide ? actions.startRide() : actions.stopRide();
      })
    )
  );

  simulateRide$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.startRide),
        switchMap(() =>
          interval(300).pipe(
            takeUntil(this.actions$.pipe(ofType(actions.stopRide)))
          )
        ),
        tap((index) => {
          this.mapService.map!.fire(
            'geolocate',
            buildGeolocateEventObject(mockPoints[index] as number[])
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private mapService: MapService
  ) {}
}
