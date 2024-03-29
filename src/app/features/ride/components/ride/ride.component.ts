import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IMapService,
  MAP_SERVICE,
} from '@app/core/services/map/map-service.interface';
import { MapViewportService } from '@app/core/services/map/map-viewport.service';
import { RideStoreFacadeService } from '@app/core/services/ride-store-facade.service';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.scss'],
})
export class RideComponent implements OnInit, OnDestroy {
  isActiveRide$ = this.storeFacadeService.isActiveRide$;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.mapViewportService.shiftMapByKeyPress(event.key);
  }

  private destroy$ = new Subject<void>();

  constructor(
    private storeFacadeService: RideStoreFacadeService,
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private mapViewportService: MapViewportService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mapService.init();
    this.mapService.mapLoaded$
      .pipe(take(1))
      .subscribe(() => this.onRideButtonClick());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRideButtonClick() {
    this.storeFacadeService.toggleRide();
    this.changeDetectorRef.detectChanges();
  }
}
