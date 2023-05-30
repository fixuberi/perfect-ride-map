import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as actions from './ride.actions';

@Injectable()
export class RideEffects {
  loadFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadFeature),
      mergeMap(() => of(actions.featureLoaded({ data: {} })))
    )
  );

  constructor(private actions$: Actions) {}
}
