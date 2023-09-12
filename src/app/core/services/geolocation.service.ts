import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

type GeolocationPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private permissionStatusSubject: BehaviorSubject<GeolocationPermissionStatus> =
    new BehaviorSubject<GeolocationPermissionStatus>('unknown');
  permissionStatus$: Observable<GeolocationPermissionStatus> =
    this.permissionStatusSubject.asObservable();
  isGeolocationActive$ = this.permissionStatus$.pipe(
    map((status) => status === 'granted')
  );

  constructor() {
    this.requestPermission();
  }

  requestPermission() {
    if (!('geolocation' in navigator)) {
      this.permissionStatusSubject.next('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.permissionStatusSubject.next('granted');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.permissionStatusSubject.next('denied');
        } else {
          this.permissionStatusSubject.next('prompt');
        }
      }
    );
  }

  checkPermissionStatus(): void {
    if (!navigator.permissions || !navigator.permissions.query) {
      console.warn('Permissions API not supported.');
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      this.permissionStatusSubject.next(result.state as any);
    });
  }
}
