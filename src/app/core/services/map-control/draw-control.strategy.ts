import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Subject } from 'rxjs';
import { BaseControlStrategy } from './control-strategy.base';

export class DrawControlStrategy extends BaseControlStrategy {
  protected control: MapboxDraw = new MapboxDraw();

  //TODO add typing for posisble events with string union type
  events = {
    event1: new Subject<any>(),
  };

  constructor(map: mapboxgl.Map) {
    super(map);

    console.error('DrawControlStrategy - need to define real draw events');
    this.map.on('event1', (event: any) => this.events['event1'].next(event));
  }
}
