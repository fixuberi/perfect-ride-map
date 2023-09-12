import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppMapService } from '@app/core/services/map/map.service';
import { MAPBOX_ACCESS_TOKEN, getMapboxAccessToken } from 'src/mapbox-config';
import { AppFlowService } from './services/app-flow.service';
import { GeolocationService } from './services/geolocation.service';
import { HrMonitorService } from './services/hr-monitor.service';
import { MapControlService } from './services/map-control/map-control.service';
import { MapLayerService } from './services/map/map-layer.service';
import { MAP_SERVICE } from './services/map/map-service.interface';
import { MapViewportService } from './services/map/map-viewport.service';
import { RideStoreFacadeService } from './services/ride-store-facade.service';
import { RideTraceService } from './services/ride-trace.service';
import { RouteNavigationService } from './services/route-navigation.service';
import { UserLocationService } from './services/user-location.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        //To unsure lazy modules use root injector service list services here
        { provide: MAP_SERVICE, useClass: AppMapService },
        { provide: MAPBOX_ACCESS_TOKEN, useValue: getMapboxAccessToken() },
        MapLayerService,
        MapViewportService,
        MapControlService,
        AppFlowService,
        HrMonitorService,
        RideTraceService,
        UserLocationService,
        RideStoreFacadeService,
        RouteNavigationService,
        GeolocationService,
      ],
    };
  }
}
