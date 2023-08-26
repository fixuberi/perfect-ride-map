import * as mapboxgl from 'mapbox-gl';
import { Observable, Subject, takeUntil } from 'rxjs';

export interface IControlStrategy {
  addControl(map: mapboxgl.Map): void;
  removeControl(map: mapboxgl.Map): void;
  getEventObservable(eventName: string): Observable<any>;
}

export abstract class BaseControlStrategy implements IControlStrategy {
  protected abstract control: any;
  protected abstract events: { [eventName: string]: Subject<any> };
  protected map!: mapboxgl.Map;
  protected destroy$: Subject<void> = new Subject<void>();

  constructor(map: mapboxgl.Map) {
    if (!map) throw new Error('Map instance is not provided');

    this.map = map;
  }

  addControl(map: mapboxgl.Map): void {
    map.addControl(this.control);
  }

  removeControl(map: mapboxgl.Map): void {
    map.removeControl(this.control);
    this.destroy$.next();
  }

  getEventObservable(eventName: string): Observable<any> {
    if (!this.events[eventName]) {
      throw new Error(`Event: ${eventName} is not supported.`);
    }

    return this.events[eventName].asObservable().pipe(takeUntil(this.destroy$));
  }
}
