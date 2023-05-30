import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsActiveRide, toggleRide } from 'src/app/features/ride/state';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  isActiveRide$ = this.store.select(selectIsActiveRide);

  constructor(private store: Store) {}

  toggleRide() {
    this.store.dispatch(toggleRide());
  }
}
