import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { interval } from 'rxjs';
import { mockRideLocations } from 'src/app/components/mock-data';
import { RideLocation } from 'src/app/core/models/geo.models';
import { MapService } from 'src/app/core/services/map.service';
import { RideHttpService } from 'src/app/core/services/ride-http.service';
import { UserLocationService } from 'src/app/core/services/user-location.service';
import { buildGeolocateEventObject } from 'src/app/core/utils/mapbox.utils';
import * as actions from './ride.actions';
import { selectCreateRideDto, selectIsActiveRide } from './ride.selectors';
import { HrMonitorService } from '@app/core/services/hr-monitor.service';

@Injectable()
export class RideEffects {
  toggleRide$ = createEffect(() =>
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
            buildGeolocateEventObject(mockRideLocations[index])
          );
        })
      ),
    { dispatch: false }
  );

  updateUserLocationMarker$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.geolocateMapEvent),
        tap((action) => {
          this.userLocationService.updateUserLocation(
            action.event.coords.latitude,
            action.event.coords.longitude
          );
        })
      ),
    { dispatch: false }
  );

  cacheUserMovementDataWhileRide$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.geolocateMapEvent),
      withLatestFrom(
        this.store.select(selectIsActiveRide),
        this.hrMonitorService.recentHeartRate$
      ),
      filter(([, isActiveRide]) => !!isActiveRide),
      map(([action, , heartRate]) => {
        return actions.cacheRideTraceLocation({
          location: {
            ...action.event.coords,
            timestamp: new Date().toISOString(),
          } as RideLocation,
          heartRate: heartRate === 0 ? null : heartRate,
        });
      })
    )
  );

  persistRideDataOnRideStop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.stopRide),
      withLatestFrom(this.store.select(selectCreateRideDto)),
      switchMap(([, createRideDto]) => {
        return this.rideHttpService.createRide(createRideDto);
      }),
      map((response) => actions.createRideSuccess())
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private mapService: MapService,
    private userLocationService: UserLocationService,
    private rideHttpService: RideHttpService,
    private hrMonitorService: HrMonitorService
  ) {}
}
