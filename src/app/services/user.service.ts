import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'https://localhost:7066/api/User/';
  constructor(private http: HttpClient) {}

  getAllUsers(){
    return this.http.get<any>(this.baseUrl);
  }
}
