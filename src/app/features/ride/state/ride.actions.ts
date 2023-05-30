import { createAction, props } from '@ngrx/store';

export const loadFeature = createAction('[Feature] Load');
export const featureLoaded = createAction(
  '[Feature] Loaded',
  props<{ data: any }>()
);
