import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MapViewportService } from '@app/core/services/map/map-viewport.service';
import { HrMonitorService } from '@core/services/hr-monitor.service';
import {
  IMapService,
  MAP_SERVICE,
} from '@core/services/map/map-service.interface';
import { RideStoreFacadeService } from '@core/services/ride-store-facade.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isActiveRide$ = this.storeFacadeService.isActiveRide$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.mapViewportService.shiftMapByKeyPress(event.key);
  }

  title = 'perfect-ride-map';
  private destroy$ = new Subject<void>();

  constructor(
    private storeFacadeService: RideStoreFacadeService,
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private mapViewportService: MapViewportService,
    private hrMonitorService: HrMonitorService
  ) {}

  ngOnInit() {
    this.mapService.init();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRideButtonClick() {
    this.storeFacadeService.toggleRide();
  }

  connectSensorClick() {
    this.hrMonitorService.setup();
  }
}
