import { GeolocateControl, Map } from 'mapbox-gl';
import { Subject } from 'rxjs';
import { BaseControlStrategy } from './control-strategy.base';

export class GeolocateControlStrategy extends BaseControlStrategy {
  protected control: GeolocateControl = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: false,
    showUserLocation: false,
  });

  //TODO add typing for posisble events with string union type
  events = {
    geolocate: new Subject<any>(),
  };

  override addControl(map: Map): void {
    super.addControl(map);

    setTimeout(() => {
      this.control.trigger();
    }, 100);
  }

  constructor(map: Map) {
    super(map);

    this.map.on('geolocate', (event: any) => {
      this.events['geolocate'].next(event);
    });
  }
}
