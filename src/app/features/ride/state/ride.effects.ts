import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';

import { Store } from '@ngrx/store';
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

  constructor(private actions$: Actions, private store: Store) {}
}
