import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRideDto } from '@core/dto/ride.dto';
import { environment } from '@env/environment';

@Injectable()
export class RideHttpService {
  constructor(private http: HttpClient) {}

  createRide(dto: CreateRideDto) {
    return this.http.post(`${environment.API_DOMAIN}/ride`, dto);
  }
}
