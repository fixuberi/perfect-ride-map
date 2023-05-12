// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Development
const BACKEND_URL = '';

export const environment = {
  production: false,
  DOMAIN: 'http://localhost:4200',
  API_DOMAIN: BACKEND_URL,
  APIs: {
    v1: `${BACKEND_URL}/v1/api`,
  },
  mapbox: {
    accessToken: '',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
