const BACKEND_URL = '';

export const environment = {
  production: true,
  DOMAIN: 'http://localhost:4200',
  API_DOMAIN: BACKEND_URL,
  APIs: {
    v1: `${BACKEND_URL}/v1/api`,
  },
  mapbox: {
    accessToken: '',
  },
};
