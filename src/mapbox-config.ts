import { InjectionToken } from '@angular/core';
import { environment } from './environments/environment';

export function getMapboxAccessToken(): string {
  return environment.mapbox.accessToken;
}

export const MAPBOX_ACCESS_TOKEN = new InjectionToken<string>(
  'MapboxAccessToken',
  {
    providedIn: 'root',
    factory: getMapboxAccessToken,
  }
);
