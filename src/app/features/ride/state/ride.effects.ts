import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import * as actions from './ride.actions';

@Injectable()
export class RideEffects {
  loadFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.startRide),
      mergeMap(() => of(actions.startRide()))
    )
  );

  constructor(private actions$: Actions) {}
}
