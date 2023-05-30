import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRide from '../features/ride/state/index';
import { CustomRouterState } from './router-state-serializer';

export interface State {
  ride: fromRide.RideState;
  router: fromRouter.RouterReducerState<CustomRouterState>;
}

export const reducers: ActionReducerMap<State> = {
  ride: fromRide.reducer,
  router: fromRouter.routerReducer,
};
