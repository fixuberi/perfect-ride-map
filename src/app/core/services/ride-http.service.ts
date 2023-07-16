import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class RideHttpService {
  constructor(private http: HttpClient) {}

  createRide(dto: any) {
    return this.http.post(`${environment.API_DOMAIN}/ride`, dto);
  }
}
