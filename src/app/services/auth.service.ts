import { ILogin } from './../models/ILogin';
import { IApiResponse } from './../models/api-response.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model"
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://localhost:7066/api/User/'
  constructor(private http: HttpClient) { }

  signUp(userObj: User) {
    return this.http.post<IApiResponse>(`${this.baseUrl}add`, userObj)
  }

  signIn(loginObj : ILogin){
    return this.http.post<User>(`${this.baseUrl}authenticate`,loginObj)
  }

}
