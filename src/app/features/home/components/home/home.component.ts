import { Component } from '@angular/core';
import { HrMonitorService } from '@app/core/services/hr-monitor.service';
import { RouteNavigationService } from '@app/core/services/route-navigation.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  hrSensorButtonColor$ = this.hrMonitorService.isConnected$.pipe(
    map(this.getSensorButtonColor)
  );
  gpsSensorButtonColor$ = this.geolocationService.isGeolocationActive$.pipe(
    map(this.getSensorButtonColor)
  );

  constructor(
    private navigationService: RouteNavigationService,
    public hrMonitorService: HrMonitorService,
    public geolocationService: GeolocationService
  ) {}

  ride() {
    this.navigationService.navigateByUrl('ride');
  }

  connectSensorClick() {
    this.hrMonitorService.setup();
  }

  getSensorButtonColor(isActiveSensor: boolean) {
    return isActiveSensor ? 'accent' : 'warn';
  }
}
