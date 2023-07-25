import { NgModule } from '@angular/core';
import { AppMapService } from '@app/core/services/map/map.service';
import { MAP_SERVICE } from './services/map/map-service.interface';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [{ provide: MAP_SERVICE, useClass: AppMapService }],
})
export class CoreModule {}
