import { Injectable } from '@angular/core';
import { parseValue } from '@utils/hr-sensor.utiils';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HrMonitorService {
  private device: BluetoothDevice | undefined;

  private recentHeartRateSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  recentHeartRate$: Observable<number> =
    this.recentHeartRateSubject.asObservable();
  isConnected$ = this.recentHeartRate$.pipe(
    map((hr) => hr !== 0 && this.isConnectedDevice)
  );

  constructor() {
    this.device = this.getStoredDevice();
  }

  get isConnectedDevice() {
    return !!this.device;
  }

  setup() {
    if (this.device && this.device.gatt?.connected) {
      this.connectToDevice(this.device);
    } else {
      (navigator as Navigator & { bluetooth: Bluetooth }).bluetooth
        .requestDevice({
          filters: [{ services: ['heart_rate'] }],
        })
        .then((device: BluetoothDevice) => {
          this.device = device;
          this.storeDevice(device);
          this.connectToDevice(device);
        })
        .catch((error: DOMException) => {
          console.log(error);
        });
    }
  }

  private connectToDevice(device: BluetoothDevice) {
    device
      .gatt!.connect()
      .then((server: BluetoothRemoteGATTServer) =>
        this.getHeartRateService(server)
      )
      .then((service: BluetoothRemoteGATTService) =>
        this.startNotifications(service)
      )
      .catch((error: DOMException) => {
        console.log(error);
      });
  }

  private getHeartRateService(
    server: BluetoothRemoteGATTServer
  ): Promise<BluetoothRemoteGATTService> {
    return server.getPrimaryService('heart_rate');
  }

  private startNotifications(
    service: BluetoothRemoteGATTService
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    return service
      .getCharacteristic('heart_rate_measurement')
      .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
        characteristic.addEventListener(
          'characteristicvaluechanged',
          this.characteristicValueChanged.bind(this)
        );
        return characteristic.startNotifications();
      });
  }

  private characteristicValueChanged(event: Event) {
    const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
    this.recentHeartRateSubject.next(parseValue(value).heartRate);
  }

  private storeDevice(device: BluetoothDevice) {
    localStorage.setItem('storedDevice', JSON.stringify(device));
  }

  private getStoredDevice(): BluetoothDevice | undefined {
    const storedDevice = localStorage.getItem('storedDevice');
    if (storedDevice) {
      return JSON.parse(storedDevice);
    }
    return undefined;
  }
}
