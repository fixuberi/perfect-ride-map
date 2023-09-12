import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMapService, MAP_SERVICE } from '../map/map-service.interface';
import { IControlStrategy } from './control-strategy.base';
import { DrawControlStrategy } from './draw-control.strategy';
import { GeolocateControlStrategy } from './geolocate-control.strategy';
import { NavigationControltrategy } from './navigation-control.strategy';

export type MapControl = 'draw' | 'navigation' | 'geolocate';
export type ControlStrategiesMap = { [key in MapControl]?: IControlStrategy };

class ControlStrategyFactory {
  static create(type: MapControl, map: mapboxgl.Map): IControlStrategy {
    switch (type) {
      case 'draw':
        return new DrawControlStrategy(map);
      case 'navigation':
        return new NavigationControltrategy(map);
      case 'geolocate':
        return new GeolocateControlStrategy(map);
      default:
        throw new Error(`Unknown strategy: ${type}`);
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class MapControlService {
  private strategies: ControlStrategiesMap = {};
  private attachedControls: MapControl[] = [];

  constructor(@Inject(MAP_SERVICE) private mapService: IMapService) {}

  private get map() {
    return this.mapService.map!;
  }

  private getStrategy(type: MapControl): IControlStrategy {
    if (!this.strategies[type]) {
      this.strategies[type] = ControlStrategyFactory.create(type, this.map);
    }

    return this.strategies[type]!;
  }

  addControl(type: MapControl): void;
  addControl(types: MapControl[]): void;
  addControl(typeInput: MapControl | MapControl[]): void {
    this.runCallbackForControlTypes(typeInput, (type) => {
      this.getStrategy(type).addControl(this.map);
      this.attachedControls.push(type);
    });
  }

  removeControl(type: MapControl): void;
  removeControl(types: MapControl[]): void;
  removeControl(typeInput: MapControl | MapControl[]): void {
    this.runCallbackForControlTypes(typeInput, (type) => {
      this.getStrategy(type).removeControl(this.map);
      this.attachedControls = this.attachedControls.filter(
        (attachedType) => type !== attachedType
      );
    });
  }

  removeAllControls(): void {
    this.attachedControls.forEach((type) => this.removeControl(type));
  }

  getEventObservable(type: MapControl, eventName: string): Observable<any> {
    return this.getStrategy(type).getEventObservable(eventName);
  }

  private runCallbackForControlTypes(
    typesInput: MapControl | MapControl[],
    action: (type: MapControl) => void
  ): void {
    if (Array.isArray(typesInput)) {
      typesInput.forEach(action);
    } else {
      action(typesInput);
    }
  }
}
