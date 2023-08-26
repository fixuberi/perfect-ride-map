import * as mapboxgl from 'mapbox-gl';
import { NavigationControl } from 'mapbox-gl';
import { Subject } from 'rxjs';
import { BaseControlStrategy } from './control-strategy.base';

export class NavigationControltrategy extends BaseControlStrategy {
  protected control: NavigationControl = new NavigationControl();

  //TODO add typing for posisble events with string union type
  events = {
    event1: new Subject<any>(),
  };

  constructor(map: mapboxgl.Map) {
    super(map);

    console.error(
      'NavigationControltrategy - need to define real draw events; mapbox.NavigationControl doesnt have Evented class nethods in runtime such as .on()'
    );
    // this.control.on('event1', (event: any) =>
    //   this.events['event1'].next(event)
    // );
  }
}
