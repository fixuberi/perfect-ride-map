import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  delay,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AppFlowService } from '@app/core/services/app-flow.service';
import { RideHttpService } from '@app/features/ride/services/ride-http.service';
import { RideLocation } from '@core/models/geo.models';
import { HrMonitorService } from '@core/services/hr-monitor.service';
import {
  IMapService,
  MAP_SERVICE,
} from '@core/services/map/map-service.interface';
import { UserLocationService } from '@core/services/user-location.service';
import { buildGeolocateEventObject } from '@core/utils/mapbox.utils';
import { Store } from '@ngrx/store';
import { interval } from 'rxjs';
import mockRideLocations from './mock-data';
import * as actions from './ride.actions';
import { selectCreateRideDto, selectIsActiveRide } from './ride.selectors';

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

  setupRideFlow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.startRide),
        withLatestFrom(this.mapService.mapLoaded$.pipe(filter(Boolean))),
        tap(() => this.appFlowService.setupRide())
      ),
    { dispatch: false }
  );

  teardoownRideFlow$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.stopRide),
        tap(() => this.appFlowService.teardownRide())
      ),
    { dispatch: false }
  );

  simulateRide$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.startRide),
        // filter(() => false),
        delay(1000),
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
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private userLocationService: UserLocationService,
    private rideHttpService: RideHttpService,
    private hrMonitorService: HrMonitorService,
    private appFlowService: AppFlowService
  ) {}
}
